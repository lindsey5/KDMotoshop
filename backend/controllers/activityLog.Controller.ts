import { Request, Response } from "express"
import ActivityLog from "../models/ActivityLog"

export const get_activity_logs = async (req : Request, res : Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const startDate = req.query.startDate as string | undefined;
        const endDate = req.query.endDate as string | undefined;

        let filter: any = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000))
            };
        } 
        else if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        else if (endDate)  filter.createdAt = { $lte: new Date(new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)) };

        const [activityLogs, totalActivities] = await Promise.all([
            ActivityLog
                .find(filter)
                .limit(limit)
                .skip(skip)
                .populate(['product_id', 'order_id', 'admin_id'])
                .sort({createdAt: -1}),
            ActivityLog.countDocuments(filter)
        ])

        res.status(200).json({ 
            success: true, 
            activityLogs,
            page,
            totalPages: Math.ceil(totalActivities / limit),
            totalActivities,
        });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}