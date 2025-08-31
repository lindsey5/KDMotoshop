import { Request, Response } from "express";
import { AuthenticatedRequest, AuthenticatedRequestWithFile } from "../types/auth";
import RefundRequest from "../models/Refund";
import { uploadVideo } from "../services/cloudinary";
import OrderItem from "../models/OrderItem";
import { sendRefundUpdate } from "../services/emailService";
import Payment from "../models/Payment";
import { refundPayment } from "../services/paymentService";
import { sendAdminsNotification, sendCustomerNotification } from "../services/notificationService";
import Order from "../models/Order";
import { isSuperAdmin } from "../services/adminService";

export const createRefundRequest = async (req :AuthenticatedRequestWithFile, res : Response) => {
    try{
        const orderItem : any = await OrderItem.findById(req.body.order_item_id).populate('order_id');
        if(!orderItem){
            res.status(404).json({ success: false, message: 'Order item id not found'});
            return;
        }

        const refund = await RefundRequest.findOne({ order_item_id: req.body.order_item_id, status: { $nin: ['Rejected', 'Cancelled']}});

        if(refund){
            res.status(409).json({ success: false, message: 'A refund request for this item has already been submitted.' })
            return;
        }
        let uploadedVideo = null;

        if (req.file) {
            uploadedVideo = await uploadVideo(req.file.path);
        } else {
            res.status(400).json({ success: false, message: "Video is required" });
            return;
        }

        const request = new RefundRequest({ ...req.body, video: uploadedVideo, customer_id: req.user_id })
        await request.save();

        await sendAdminsNotification({
            from: req.user_id as string,
            order_id: orderItem.order_id._id,
            content: `Has requested a refund for ${orderItem.order_id.order_id}.`,
            refund_id: request._id as string,
        });

        res.status(201).json({ success: true, request });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const getRefundRequests = async (req : AuthenticatedRequest, res : Response) => {
    try{
        await isSuperAdmin(req, res)
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

        if(status && status !== 'All'){
            filter.status = status;
        }

        const [refundRequests, total] = await Promise.all([
        RefundRequest.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('customer_id', ['image', 'firstname', 'lastname', 'email'])
            .populate({
                path: 'order_item_id',
                populate: [
                {
                    path: 'order_id',
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

export const updateRefundRequest = async (req : Request, res : Response) => {
    try{
        await isSuperAdmin(req, res)
        const { status } = req.body;
        const refundRequest = await RefundRequest.findById(req.params.id)

        if(!refundRequest){
            res.status(404).json({ success: false, message: 'Refund request not found' });
            return;
        }

        const order_item = await OrderItem.findById(refundRequest.order_item_id);
        if(!order_item){
            res.status(404).json({ success: false, message: 'Order item not found' });
            return;
        }

        refundRequest.status = status;

        await refundRequest.save();
        const populatedRefund : any = await refundRequest.populate({
            path: 'order_item_id',
            populate: [
                {
                    path: 'order_id',
                    populate: 'customer.customer_id',
                    select: 'order_id firstname lastname email phone'
                },
                {
                    path: 'product_id',
                    select: 'product_name thumbnail'
                }
            ]
        })
        
        const orderItems : any = await OrderItem.find({ order_id: order_item.order_id}).populate('refund')

        if(orderItems.every((item : any) => item.refund.status === 'Completed')){
            const order = await Order.findById(order_item.order_id)
            if(order){
                order.status = 'Refunded';
                await order.save();
            }
        }

        await sendRefundUpdate({
            email:  populatedRefund.order_item_id.order_id.customer.customer_id.email,
            order_id:  populatedRefund.order_item_id.order_id.order_id,
            firstname:  populatedRefund.order_item_id.order_id.customer.customer_id.firstname,
            status,
            product_name:  populatedRefund.order_item_id.product_id.product_name,
            quantity:  populatedRefund.quantity,
            product_image:  populatedRefund.order_item_id.product_id.thumbnail.imageUrl
        })

        await sendCustomerNotification({
            refund_id: refundRequest._id as string,
            to: refundRequest.customer_id.toString(), 
            order_id: populatedRefund.order_item_id.order_id._id, 
            content: `Your refund request for ${populatedRefund.order_item_id.order_id.order_id} has been updated to ${status}`,
        });

        if(status === 'Completed'){
            const payment = await Payment.findOne({ order_id: populatedRefund.order_item_id.order_id._id });
            if(payment) await refundPayment(payment.payment_id, populatedRefund.totalAmount * 100);
        }

        res.status(200).json({ success: true, message: 'Refund request updated successfully', refundRequest });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}