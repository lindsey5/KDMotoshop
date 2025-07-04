import Category from "../models/Category";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";

export const create_category = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const { category_name } =  req.body;

        if(!category_name) {
            res.status(400).json({ success: false, message: 'Category name required'})
            return;
        }

        const category = await Category.findOne({ category_name: category_name });

        if(category) {
            res.status(409).json({ success: false, message: 'Category already exist'});
            return;
        }

        const newCategory = new Category({category_name, added_by: req.user_id});

        await newCategory.save();

        res.status(201).json({ success: true, newCategory });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const get_categories =  async(req: Request, res: Response) => {
    try{
        const categories = await Category.find({});

        res.status(200).json({ success: true, categories });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const delete_category = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(409).json({ success: false, message: 'Category does not exist' });
            return;
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Category deleted successfully' });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

export const get_top_categories = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
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
          totalQuantity: { $sum: '$quantity' },
          image: { $first: '$product.thumbnail.imageUrl' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $project: {
          category: '$_id',
          totalQuantity: 1,
          image: 1,
          _id: 0
        }
      }
    ])

    res.status(200).json({ success: true, topCategories })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}
