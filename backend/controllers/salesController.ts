import { Request, Response } from "express";
import Order from "../models/Order";

export const get_monthly_sales = async (req: Request, res: Response) => {
    try{
        const yearParam = req.query.year as string;
        const year = parseInt(yearParam, 10) || new Date().getFullYear();

        const start = new Date(`${year}-01-01T00:00:00Z`);
        const end = new Date(`${year + 1}-01-01T00:00:00Z`);

        const monthlySales = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lt: end },
                status: { $in: ['Completed', 'Rated'] }
            }
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                total: { $sum: '$total' }
            }
        },
        {
            $project: {
                month: '$_id.month',
                total: 1,
                _id: 0
            }
        }
        ]);

        res.status(200).json({ success: true, monthlySales });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message});
    }
}