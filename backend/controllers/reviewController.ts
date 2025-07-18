import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Review from "../models/Review";
import Order from "../models/Order";
import Product from "../models/Product";
import OrderItem from "../models/OrderItem";

export const create_review = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { orderItemId, product_id } = req.body;

        const orderItem= await OrderItem.findById(orderItemId);

        if(!orderItem){
            res.status(404).json({success: false, message: 'Order ID doesn\'t exist'});
            return;
        }

        const product = await Product.findById(product_id);

        if(!product){
            res.status(404).json({success: false, message: 'Product ID doesn\'t exist'})
            return;
        }

        const review = new Review({...req.body, customer_id: req.user_id});
        await review.save();

        orderItem.status = 'Rated';
        await orderItem.save();
        
        const orderItems = await OrderItem.find({ order_id: orderItem.order_id });

        if(orderItems.every(item => item.status === 'Rated')){
            await Order.findByIdAndUpdate(orderItem.order_id, { status: 'Rated'}, { new: true })
        }

        res.status(201).json({ success: true, review })

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}

export const get_product_reviews = async (req: Request, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const [reviews, totalReviews] = await Promise.all([
            Review.find({ product_id: req.params.id})
                .skip(skip)
                .limit(limit)
                .populate('customer_id', ['image', 'firstname', 'lastname'])
                .sort({ createdAt: -1 }),
            Review.countDocuments({ product_id: req.params.id}),
        ]);

        const rating = reviews.length > 0 ? (reviews.reduce((total, review) => review.rating + total, 0) / totalReviews).toFixed(1) : 0

        res.status(200).json({ 
            success: true, 
            reviews, 
            rating, 
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews,
        });
    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}