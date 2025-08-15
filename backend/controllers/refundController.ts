import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import RefundRequest from "../models/Refund";
import { uploadVideo } from "../services/cloudinary";
import OrderItem from "../models/OrderItem";

export const createRefundRequest = async (req :AuthenticatedRequest, res : Response) => {
    try{
        const { video, ...rest } = req.body;

        const orderItem = await OrderItem.findById(req.body.order_item_id);

        if(!orderItem){
            res.status(404).json({ success: false, message: 'Order item id not found'});
            return;
        }

        const refund = await RefundRequest.findOne({ order_item_id: req.body.order_item_id, status: { $nin: ['Rejected', 'Cancelled']}});

        if(refund){
            res.status(409).json({ success: false, message: 'A refund request for this item has already been submitted.' })
            return;
        }
        
        const uploadedVideo = await uploadVideo(video as string)
        const request = new RefundRequest({ ...rest, video: uploadedVideo, customer_id: req.user_id })
        await request.save();

        orderItem.refund_status = 'Pending';
        await orderItem.save();

        res.status(201).json({ success: true, request });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const getRefundRequests = async (req : Request, res : Response) => {
    try{
         const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.searchTerm as string | undefined;
        const status = req.query.status as string | undefined;

        let filter : any = {};

        if(searchTerm){
            filter.$or = [
                { 'customer_id.firstname' : { $regex: searchTerm, $options: 'i' }  },
                { 'customer_id.lastname' : { $regex: searchTerm, $options: 'i' }  },
                { 'order_item_id.order_id' : { $regex: searchTerm, $options: 'i' }  },
                { 'order_item_id.product_id.product_name' : { $regex: searchTerm, $options: 'i' }  }
            ]
        }

        if(status){
            filter.status = status;
        }

        const [refundRequests, total] = await Promise.all([
        RefundRequest.find()
            .skip(skip)
            .limit(limit)
            .populate('customer_id', ['image', 'firstname', 'lastname'])
            .populate({
                path: 'order_item_id',
                populate: [
                {
                    path: 'order_id',
                    select: 'order_id',
                },
                {
                    path: 'product_id',
                    select: 'product_name thumbnail'
                }
                ]
            }),
        RefundRequest.countDocuments(filter)
            .populate('customer_id')
            .populate({
                path: 'order_item_id',
                populate: [
                {
                    path: 'order_id',
                    select: 'order_id',
                },
                {
                    path: 'product_id',
                    select: 'product_name thumbnail'
                }
                ]
            })
        ]);

        res.status(200).json({
            success: true,
            refundRequests,
            page,  
            totalPages: Math.ceil(total / limit),
        });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}