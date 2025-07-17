import {  Response } from "express";
import CustomerNotification from "../models/CustomerNotification";
import { AuthenticatedRequest } from "../types/auth";

export const get_customer_notifications =  async(req: AuthenticatedRequest, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const [notifications, totalNotifications, totalUnread] = await Promise.all([
            await CustomerNotification
            .find({ to: req.user_id})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1}),
            await CustomerNotification.countDocuments({ to: req.user_id}),
            await CustomerNotification.countDocuments({ to: req.user_id, isViewed: false})
        ])

        res.status(200).json({ 
            success: true, 
            notifications,
            page,
            totalPages: Math.ceil(totalNotifications / limit),
            totalUnread,
            totalNotifications,
        });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}


export const update_customer_notification =  async(req: AuthenticatedRequest, res: Response) => {
    try{
        const notification = await CustomerNotification.findById(req.params.id);

        if(!notification){
            res.status(404).json({ success: false, message: 'Notification not found'})
            return
        }
        
        notification.isViewed = true

        await notification.save();

        res.status(200).json({ success: true, notification });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}