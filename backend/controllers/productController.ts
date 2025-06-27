import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { deleteImage, uploadImage } from "../services/cloudinary";
import Product from "../models/Product";
import { UploadedImage } from "../types/types";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import { Types } from "mongoose";

export const create_product = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const product = req.body;

        const thumbnail = await uploadImage(product.thumbnail);
        const images = await Promise.all(product.images.map(async (image : string) => await uploadImage(image)))

        const newProduct = new Product({ 
            ...product, 
            thumbnail, 
            images, 
            added_by: req.user_id 
        })

        await newProduct.save();

        res.status(201).json({ success: true, newProduct});

    }catch(err : any){
      console.log(err)
      res.status(500).json({ success: false, message: err.message });
    }
}

export const get_products = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = req.query.searchTerm as string | undefined;
  const category = req.query.category as string | undefined;

  try {
    let filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { product_name: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { "variants.sku": { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (category && category !== "All") filter.category = category;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("added_by")
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      page,  
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const get_products_with_reserved = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = req.query.searchTerm as string | undefined;
  const category = req.query.category as string | undefined;

  try {
    let filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { product_name: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { "variants.sku": { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (category && category !== "All") filter.category = category;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("added_by")
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    const orderStatuses = ["Pending", "Accepted", "Shipped"];

    const orders = await Order.find({ status: { $in: orderStatuses } }, "_id");
    const orderIds = orders.map(order => order._id);

    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } });

    const stockMap = new Map<string, number>();
    orderItems.forEach(item => {
      const key = item.product_id + (item.variant_id || "");
      stockMap.set(key, (stockMap.get(key) || 0) + item.quantity);
    });

    products.forEach(product => {
      const key = (product._id as Types.ObjectId).toString();
      const orderedQty = stockMap.get(key) || 0;
      product.stock = Math.max((product.stock || 0) - orderedQty, 0);
      
      if(product.variants.length > 0){
        product.variants?.forEach(variant => {
          const varKey = product._id + variant._id.toString();
          const varOrderedQty = stockMap.get(varKey) || 0;
          variant.stock = Math.max((variant.stock || 0) - varOrderedQty, 0);
        });
      }
    });

    res.status(200).json({
      success: true,
      products,
      page,  
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_product_by_id = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if(!product){
      res.status(404).json({ success: false, message: 'Product not found'})
      return;
    }

    res.status(200).json({ success: true, product })

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update_product = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = req.body;

    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const isExist = await Product.findOne({ _id: { $ne: id },  product_name: product.product_name });

    if (isExist) {
      res.status(400).json({ success: false, message: 'Product name already exists.'});
      return;
    }

    let thumbnail : UploadedImage | null = oldProduct.thumbnail;
    if (typeof product.thumbnail === 'string') {
      await deleteImage(thumbnail?.imagePublicId);
      thumbnail = await uploadImage(product.thumbnail);
    }

    const images = await Promise.all(
      product.images.map(async (img : UploadedImage | string) => {
        if (typeof img === 'object') return img;

        return await uploadImage(img);
      })
    );

    for (const oldImg of oldProduct.images) {
      const stillUsed = images.find(newImg => newImg.imagePublicId === oldImg.imagePublicId);
      if (!stillUsed) await deleteImage(oldImg.imagePublicId);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { ...product, thumbnail, images }, { new: true });

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_top_products = async (req: Request, res: Response) => {
  try{
    const topProducts = await OrderItem.aggregate([
      { 
        $group: { 
          _id: '$product_name',
          totalQuantity: { $sum: '$quantity'},
          image: { $first: '$image' }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          product_name: '$_id',
          totalQuantity: 1,
          image: 1,
          _id: 0
        }
      }
    ])

    res.status(200).json({ success: true, topProducts})

  }catch(err : any){
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export const get_top_categories = async (req: Request, res: Response) => {
  try{
    const topCategories = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { 
        $group: { 
          _id: '$product.category',
          totalQuantity: { $sum: '$quantity'},
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          category: '$_id',
          totalQuantity: 1,
          _id: 0
        }
      }
    ])

    res.status(200).json({ success: true, topCategories})

  }catch(err : any){
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}