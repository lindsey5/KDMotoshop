import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import OrderItem from "../models/OrderItem";
import Refund from "../models/Refund";

export const getItemToRefund = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { id } = req.params;

        const orderItems = await OrderItem.find({ order_id: id }).populate('product_id', ['thumbnail', 'product_name']);
        const refunds = await Refund.find({ order_id: id });

        const itemsCanBeRefunded = orderItems.map(item => {
            const refundDoc = refunds.find(refund =>
                refund.items.some(refundItem =>
                refundItem.order_item_id === item._id
                )
            );

            if (!refundDoc) return item.toObject();

            const refundedItem = refundDoc.items.find(refundItem =>
                refundItem.order_item_id === item._id
            );

            const refundedQuantity = refundedItem ? refundedItem.quantity : 0;

            return {
                ...item.toObject(),
                quantity: item.quantity - refundedQuantity
            };
        });
        
        res.status(200).json({success: true, itemsCanBeRefunded})

    }catch(err : any){
        res.status(500).json({ error: err.message });
    }
}