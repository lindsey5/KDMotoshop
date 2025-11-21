import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { deleteImage, uploadImage } from "../services/cloudinary";
import Product, { IProduct } from "../models/Product";
import { UploadedImage } from "../types/types";
import OrderItem from "../models/OrderItem";
import { create_activity_log } from "../services/activityLogServices";
import Admin from "../models/Admin";
import { createProductFilter, determineSortOption } from "../utils/filter";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from "dayjs/plugin/isoWeek";
import redisClient from "../utils/redisClient";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

const validate_product = async (product : IProduct) => {
  
    // Check for duplicate SKUs within the same product
    if (product.variants && product.variants.length > 0) {
      const skuSet = new Set();
      const duplicates : any = [];
  
      product.variants.forEach((variant) => {
        if (skuSet.has(variant.sku)) {
          duplicates.push(variant.sku);
        }
        skuSet.add(variant.sku);
      });
  
      if (duplicates.length > 0) {
        throw new Error(`Duplicate SKUs found in variants: ${duplicates.join(', ')}`)
      }
    }
  
    // Check for duplicate SKUs across all products
    const allSkus = [
      product.sku,
      ...(product.variants ? product.variants.map((v) => v.sku) : []),
    ].filter(Boolean);
    const existing = await Product.find({
      _id: { $ne: product._id }, 
      $or: [
        { sku: { $in: allSkus } },
        { 'variants.sku': { $in: allSkus } },
      ],
    });
  
    if (existing.length > 0) {
      throw new Error(`SKUs already exist in another product: ${existing.map(e => e.sku).join(', ')}`)
    }
}

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

        await validate_product(newProduct);

        await newProduct.save();

        const admin = await Admin.findById(req.user_id);

        if(admin){
          await create_activity_log({
            admin_id: req.user_id ?? '',
            description: 'created a new product',
            product_id: newProduct._id as string,
          })
        }

        res.status(201).json({ success: true, newProduct});

    }catch(err : any){
      console.log(err)
      res.status(500).json({ success: false, message: err.message });
    }
}

export const delete_product = async (req: Request, res: Response) => {
  try{
    const product = await Product.findById(req.params.id);

    if(!product){
      res.status(404).json({ success: false, message: 'Product not found'});
      return;
    }

    product.visibility = 'Deleted';
    await product.save(); 
    res.status(200).json({ success: true, message: 'Product successfully deleted.'})

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
    const min = req.query.min as number | undefined;
    const max = req.query.max as number | undefined;
    const visibility = req.query.visibility as string | undefined;

    try {
      const filter = createProductFilter({ searchTerm, category, min, max, visibility})
      const sortOption = determineSortOption(req.query.sort as string ?? '')

      const [products, total] = await Promise.all([
        Product.find(filter)
          .populate("added_by", ["firstname", "lastname"])
          .skip(skip)
          .sort(sortOption)
          .limit(limit)
          .lean() ,
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

export const get_product_by_id = async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);

      if(!product || product.visibility === 'Deleted'){
        res.status(404).json({ success: false, message: 'Product not found'})
        return;
      }

      res.status(200).json({ success: true, product })

    } catch (err: any) {
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
};

export const get_published_product_by_id = async (req : Request, res : Response) => {
  try{
      const product = await Product.findById(req.params.id);

      if(!product || product.visibility !== 'Published'){
        res.status(404).json({ success: false, message: 'Product not found'})
        return;
      }

      res.status(200).json({ success: true, product })

  }catch(err : any){
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Utility to calculate total stock
const calculateTotalStock = (product: any) => {
  if (product.product_type === 'Variable') {
    return product.variants.reduce((total: number, variant: any) => total + variant.stock, 0);
  }
  return product.stock ?? 0;
};

export const update_product = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = req.body;

    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (oldProduct.visibility === 'Deleted') {
        res.status(404).json({ 
          success: false, 
          message: 'This product has been deleted and is no longer available.' 
        });
        return;
    }

    const isExist = await Product.findOne({
      _id: { $ne: id },
      product_name: product.product_name
    });
    if (isExist) {
      res.status(400).json({ success: false, message: 'Product name already exists.' });
      return;
    }

    await validate_product(product as IProduct)

    // Handle thumbnail upload
    let thumbnail: UploadedImage | null = oldProduct.thumbnail;
    if (typeof product.thumbnail === 'string') {
      await deleteImage(thumbnail?.imagePublicId);
      thumbnail = await uploadImage(product.thumbnail);
    }

    // Handle images upload
    const images = await Promise.all(
      product.images.map(async (img: UploadedImage | string) => {
        if (typeof img === 'object') return img;
        return await uploadImage(img);
      })
    );

    // Delete unused old images
    for (const oldImg of oldProduct.images) {
      const stillUsed = images.find(newImg => newImg.imagePublicId === oldImg.imagePublicId);
      if (!stillUsed) await deleteImage(oldImg.imagePublicId);
    }

    // Adjust fields based on product_type
    if (product.product_type !== oldProduct.product_type) {
      if (product.product_type === 'Variable') {
        product.sku = null;
        product.price = null;
        product.stock = null;
      } else {
        product.attributes = [];
        product.variants = [];
      }
    }

    // Store previous values for comparison
    const oldValues = oldProduct.toObject();

    // Update product
    oldProduct.set({ ...product, thumbnail, images });
    await oldProduct.save();

    // Fields to check for changes
    const fieldsToTrack: (keyof IProduct)[] = [
      'product_name',
      'description',
      'category',
      'sku',
      'price',
      'stock',
      'product_type',
      'visibility',
    ];

    // Check changes in each field
    for (const field of fieldsToTrack) {
      let prevValue = oldValues[field];
      let newValue = oldProduct[field];
      if(field === 'stock'){
        prevValue = calculateTotalStock(oldValues);
        newValue = calculateTotalStock(oldProduct);
      } 
      if (String(prevValue) !== String(newValue)) {
        await create_activity_log({
          admin_id: req.user_id ?? '',
          description: `updated ${field} for ${oldValues.product_name}`,
          product_id: oldProduct._id as string,
          prev_value: String(prevValue ?? ''),
          new_value: String(newValue ?? '')
        });
      }
    }

    res.status(200).json({
      success: true,
      product: oldProduct
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_top_products = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || undefined;
    const filterType = req.query.filter || "all";

    const now = dayjs().tz('Asia/Manila');
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (filterType) {
      case "thisMonth":
        startDate = now.startOf("month").toDate();
        endDate = now.endOf("month").add(1, "day").startOf("day").toDate();
        break;
      case "lastMonth":
        startDate = now.subtract(1, "month").startOf("month").toDate();
        endDate = now.subtract(1, "month").endOf("month").add(1, "day").startOf("day").toDate();
        break;
      case "all":
        startDate = null;
        endDate = null;
        break;
    }

    const matchStage: any = { status: "Fulfilled" };
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    const topProductsAggregation = await OrderItem.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$product_id",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      ...(limit ? [{ $limit: limit }] : []),
    ]);

    const topProductIds = topProductsAggregation.map((item) => item._id);
    const products = await Product.find({ _id: { $in: topProductIds } });

    const topProducts = topProductsAggregation.map((item) => {
      const product = products.find(p => p.id === item._id.toString());
      if (!product) return null;

      return {
        _id: product._id,
        product_name: product.product_name,
        image: product.thumbnail.imageUrl,
        rating: product.rating,
        totalQuantity: item.totalQuantity,
        stock:
          product.product_type === "Variable"
            ? product.variants.reduce((total: number, v: any) => total + (v.stock ?? 0), 0)
            : product.stock,
        price:
          product.product_type === "Variable"
            ? product.variants
                ?.sort((a: any, b: any) => (a.price || 0) - (b.price || 0))[0]
                .price
            : product.price,
      };
    }).filter(Boolean); // remove nulls

    res.status(200).json({ success: true, topProducts });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_inventory_status = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = (req.query?.searchTerm as string) || '';
    const status = req.query.status && req.query.status !== 'All' ? req.query.status : '';

    const cacheKey = `inventory:${searchTerm}`;
    const cached = await redisClient.get(cacheKey);

    let allProducts: any[] = [];

    if(cached){
      allProducts = JSON.parse(cached)
    }else{
      const filter: any = { visibility: { $ne: 'Deleted' } };

      if (searchTerm) {
        filter.$or = [
          { 'variants.sku': { $regex: searchTerm, $options: 'i' } },
          { sku: { $regex: searchTerm, $options: 'i' } },
          { product_name: { $regex: searchTerm, $options: 'i' } },
        ];
      }

      const products = await Product.find(filter).sort({ product_name: 1 });

      for (const product of products) {
        if (product.product_type === "Variable") {
          // For each variant
          for (const variant of product.variants) {
            const inventory = await product.getStockStatus(variant.sku);
            allProducts.push({
              _id: product._id,
              product_name: product.product_name,
              thumbnail: product.thumbnail,
              product_type: product.product_type,
              sku: variant.sku,
              stock: variant.stock,
              ...inventory,
            });
          }
        } else {
          const inventory = await product.getStockStatus();
          allProducts.push({
            _id: product._id,
            product_name: product.product_name,
            thumbnail: product.thumbnail,
            product_type: product.product_type,
            sku: product.sku,
            stock: product.stock,
            ...inventory,
          });
        }
      }

      await redisClient.setex(cacheKey, 120, JSON.stringify(allProducts));
    }

    const filteredProducts = status
      ? allProducts.filter((p) => p.status === status)
      : allProducts;

    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      products: paginatedProducts,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const total_products = async (req: Request, res: Response) => {
  try{
      const total = await Product.countDocuments({ visibility: { $ne: 'Deleted' }});
      res.status(200).json({ success: true, total });
  }catch(err : any){
      console.log(err)
      res.status(500).json({ success: false, message: err.message });
  }
};