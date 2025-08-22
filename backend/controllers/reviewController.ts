import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Review from "../models/Review";
import Order from "../models/Order";
import Product from "../models/Product";
import OrderItem from "../models/OrderItem";
import Customer from "../models/Customer";
import { sendAdminsNotification } from "../services/notificationService";
import { Types } from "mongoose";

export const create_review = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { orderItemId, product_id } = req.body;

        // Find customer
        const customer = await Customer.findById(req.user_id);

        if(!customer){
            res.status(404).json({ success: false, message: 'Customer Id not found'})
            return;
        }

        // Find order item
        const orderItem= await OrderItem.findById(orderItemId);

        if(!orderItem){
            res.status(404).json({success: false, message: 'Order ID doesn\'t exist'});
            return;
        }

        // Find product
        const product = await Product.findById(product_id);

        if(!product){
            res.status(404).json({success: false, message: 'Product ID doesn\'t exist'})
            return;
        }

        // Create new review
        const review = new Review({...req.body, customer_id: req.user_id});
        await review.save();

        // Calculate rating based on reviews
        const productReviews = await Review.find({ product_id: product._id });
        const totalRating = productReviews.reduce((total, review) => total + review.rating, 0);
        product.rating = Number((totalRating / productReviews.length).toFixed(1));
        await product.save();

        // Change the order item status to rated
        orderItem.status = 'Rated';
        await orderItem.save();
        
        //  Get order items
        const orderItems = await OrderItem.find({ order_id: orderItem.order_id });

        // If every order items is "Rated" update the status of order to "Rated"
        if(orderItems.every(item => item.status === 'Rated' || item.status === 'Refunded')) await Order.findByIdAndUpdate(orderItem.order_id, { status: 'Rated'}, { new: true })

        await sendAdminsNotification(
            {
                from: customer._id as string,
                product_id: product_id,
                review_id: review._id.toString(),
                content: `New review for ${product.product_name} by ${customer.firstname} ${customer.lastname}`
            }
        )

        res.status(201).json({ success: true, review })

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}

export const get_item_review = async (req: Request, res: Response) => {
    try{
        const review = await Review.findOne({ orderItemId: req.params.id })

        if(!review){
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }

        res.status(200).json({ success: true, review });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}

export const get_product_reviews = async (req: Request, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const rating = parseInt(req.query.rating as string) || 0;
        const id = req.query.id as string || '';

        const query: any = { product_id: req.params.id };
        if (rating > 0) query.rating = rating ;
        if(id) query._id = id;

        const [reviews, totalReviews, overallTotal] = await Promise.all([
            Review.find(query)
                .skip(skip)
                .limit(limit)
                .populate('customer_id', ['image', 'firstname', 'lastname'])
                .populate('orderItemId')
                .sort({ createdAt: -1 }),
            Review.countDocuments(query),
            Review.countDocuments({ product_id: req.params.id })
        ]);

        res.status(200).json({ 
            success: true, 
            reviews, 
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
            overallTotal,
            totalReviews,
        });
    }catch(err : any){
        console.log(err);
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}