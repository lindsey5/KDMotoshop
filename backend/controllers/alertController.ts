import { Request, Response } from "express";
import Alert from "../models/Alert";

export const getLowStockAlerts = async (req : Request, res : Response) => {
    try{
        const alerts = await Alert.find({ is_resolved: false })
            .populate('product_id', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, alerts });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server Error'})
    }
}