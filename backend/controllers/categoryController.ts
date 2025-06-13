import Category from "../models/Category";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";

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

        res.status(201).json({ success: true, categories });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}