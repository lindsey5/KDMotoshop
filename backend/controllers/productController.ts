import e, { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { deleteImage, uploadImage } from "../services/cloudinary";
import Product, { IProduct } from "../models/Product";
import { UploadedImage } from "../types/types";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import { Types } from "mongoose";
import { create_activity_log } from "../services/activityLogServices";
import Admin from "../models/Admin";
import { createProductFilter, determineSortOption } from "../utils/filter";

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
        Product.find({...filter, status: { $ne: 'Deleted' }})
          .populate("added_by", ["firstname", "lastname"])
          .skip(skip)
          .sort(sortOption)
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
    const min = req.query.min as number | undefined;
    const max = req.query.max as number | undefined;
    const visibility = req.query.visibility as string | undefined;

    try {
      const filter = createProductFilter({ searchTerm, category, min, max, visibility})
      const sortOption = determineSortOption(req.query.sort as string ?? '')

      const [products, total] = await Promise.all([
        Product.find(filter)
          .populate("added_by")
          .sort(sortOption)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter),
      ]);
  
      const orders = await Order.find({ status: "Confirmed"}, "_id");
      const orderIds = orders.map(order => order._id);

      const orderItems = await OrderItem.find({ order_id: { $in: orderIds } });

      const stockMap = new Map<string, number>();
      orderItems.forEach(item => {
        const key = item.product_id + item.sku;
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
      console.error(err);
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
      console.log(err);
      res.status(500).json({ success: false, message: err.message });
    }
};

export const get_product_by_id_with_reserved = async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);

      if(!product){
        res.status(404).json({ success: false, message: 'Product not found'})
        return;
      }

      const orders = await Order.find({status: "Confirmed"}, "_id" );

      const orderIds = orders.map(order => order._id);

      const orderItems = await OrderItem.find({ order_id: { $in: orderIds }, product_id: product._id });

      const stockMap = new Map<string, number>();
      orderItems.forEach(item => {
        const key = item.product_id + item.sku;
        stockMap.set(key, (stockMap.get(key) || 0) + item.quantity);
      });

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

      res.status(200).json({ success: true, product })

    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
};

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

    const isExist = await Product.findOne({
      _id: { $ne: id },
      product_name: product.product_name
    });
    if (isExist) {
      res.status(400).json({ success: false, message: 'Product name already exists.' });
      return;
    }

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
        product.attributes = null;
        product.variants = null;
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
      'weight'
    ];

    // Check changes in each field
    for (const field of fieldsToTrack) {
      const prevValue = oldValues[field];
      const newValue = oldProduct[field];
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

    const prevStock = calculateTotalStock(oldValues);
    const currentStock = calculateTotalStock(oldProduct);
    if (prevStock !== currentStock) {
      await create_activity_log({
        admin_id: req.user_id ?? '',
        description: `updated stock for ${oldValues.product_name}`,
        product_id: oldProduct._id as string,
        prev_value: String(prevStock),
        new_value: String(currentStock)
      });
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
    try{
      const limit = Number(req.query.limit) || 5;
      const filterType = req.query.filter || 'all'
      const now = new Date();
      let startDate, endDate;

      switch(filterType) { // 'thisMonth', 'lastMonth', 'all'
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'all':
          startDate = null;
          endDate = null;
          break;
      }

      const matchStage: any = { status: 'Fulfilled' }; // 'any' bypasses TS checks

      if (startDate && endDate) {
        matchStage.createdAt = { $gte: startDate, $lt: endDate };
      }

      const topProductsAggregation = await OrderItem.aggregate([
        { $match: matchStage },
        { 
          $group: { 
            _id: '$product_id',
            totalQuantity: { $sum: '$quantity' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit }
      ]);

      // Get the top 10 product IDs
      const topProductIds = topProductsAggregation.map(item => item._id);

      // Fetch matching products
      const products = await Product.find({ _id: { $in: topProductIds } });

      // Merge product data with totalQuantity from aggregation
      const topProducts = topProductsAggregation.map(item => {
        const product = products.find((p : any) => p._id.toString() === item._id.toString());

        if (!product) return null;

        return {
          _id: product._id,
          product_name: product.product_name,
          image: product.thumbnail.imageUrl,
          rating: product.rating,
          totalQuantity: item.totalQuantity,
          stock: product.product_type === 'Variable' ? product.variants.reduce((total, v) => total + (v.stock ?? 0), 0) : product.stock,
          price: product.product_type === 'Variable' ? product.variants?.sort((a, b) => (a.price || 0) - (b.price || 0))[0].price : product.price,
        };
      });

      res.status(200).json({ success: true, topProducts });


    }catch(err : any){
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
}

export const get_products_stock_status = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysPassed = Math.max(1, Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) );

    // 1. Aggregate daily sales per SKU
    const dailySales = await OrderItem.aggregate([
      {
        $match: {
          status: { $in: ["Fulfilled", "Rated"] },
          createdAt: { $gte: startOfMonth, $lte: now },
        },
      },
      {
        $addFields: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },
      {
        $group: {
          _id: { sku: "$sku", product_id: "$product_id", day: "$day" },
          qty: { $sum: "$quantity" },
        },
      },
      {
        $group: {
          _id: { sku: "$_id.sku", product_id: "$_id.product_id" },
          daily: { $push: "$qty" },
          totalQty: { $sum: "$qty" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $addFields: {
          stock: {
            $cond: [
              { $eq: ["$product.product_type", "Variable"] },
              {
                $let: {
                  vars: {
                    matchedVariant: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$product.variants",
                            as: "v",
                            cond: { $eq: ["$$v.sku", "$_id.sku"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$matchedVariant.stock",
                },
              },
              "$product.stock",
            ],
          },
        },
      },
      {
        $project: {
          sku: "$_id.sku",
          product_name: "$product.product_name",
          current_stock: "$stock",
          daily: 1,
          totalQty: 1,
        },
      },
    ]);

    // 2. Compute stock status for each product
    const leadTimeDays = 7; // default (can be per supplier)
    const serviceLevelZ = 1.65; // 95% confidence

    const results = dailySales.map((p) => {
      const dailyArr = p.daily.length ? p.daily : [0];

      // Average daily sales
      const avgDailySales = p.totalQty / daysPassed;

      // Standard deviation of daily sales
      const mean = avgDailySales;
      const variance =
        dailyArr.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) /
        dailyArr.length;

      const stdDev = Math.sqrt(variance);

      // Dynamic safety stock
      const safetyStock = Math.ceil(
        serviceLevelZ * stdDev * Math.sqrt(leadTimeDays)
      );

      // Reorder point
      const reorderPoint = Math.ceil(avgDailySales * leadTimeDays + safetyStock);

      // Status
      let status = "In Stock";
      if (!p.current_stock || p.current_stock <= 0) status = "Out of Stock";
      else if (p.current_stock <= reorderPoint) status = "Low Stock";

      return {
        sku: p.sku,
        name: p.product_name,
        current_stock: p.current_stock ?? 0,
        avg_daily_sales: avgDailySales.toFixed(2),
        safety_stock: safetyStock,
        reorder_point: reorderPoint,
        status,
      };
    });

    res.json({ success: true, products: results });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};