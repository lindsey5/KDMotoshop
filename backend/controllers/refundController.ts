import { Response } from "express";
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
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}