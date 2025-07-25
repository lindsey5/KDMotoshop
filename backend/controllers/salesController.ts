import { Request, Response } from "express";
import Order from "../models/Order";

export const get_monthly_sales = async (req: Request, res: Response) => {
    try{
        const yearParam = req.query.year as string;
        const year = parseInt(yearParam, 10) || new Date().getFullYear();

        const start = new Date(`${year}-01-01T00:00:00Z`);
        const end = new Date(`${year + 1}-01-01T00:00:00Z`);

        const salesArray = new Array(12);

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

        // Populate the incomes_array with the monthly totals
        monthlySales.forEach(sale => {
            salesArray[sale.month - 1] = sale.total;
        });

        res.status(200).json({ success: true, monthlySales: salesArray });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message});
    }
}

export const get_daily_sales = async (req: Request, res: Response) => {
    try{
        const today = new Date();

        // Start of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // End of the current month (last millisecond)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const dailySales = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfMonth, $lte: endOfMonth },
              status: { $in: ['Completed', 'Rated'] }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Manila" }
              },
              total: { $sum: "$total" }
            }
          },
          {
            $sort: { _id: 1 } 
          },
          {
            $project: {
              date: '$_id',
              total: 1,
              _id: 0,
            }
          }
        ]);

        res.status(200).json({ success: true, dailySales });

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message});
    }
}

export const get_sales_statistics = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    // Start of today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [salesToday, salesThisWeek, salesThisMonth, salesThisYear] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $in: ['Completed', 'Rated'] } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek }, status: { $in: ['Completed', 'Rated'] }} },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $in: ['Completed', 'Rated'] }} },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear }, status: { $in: ['Completed', 'Rated'] } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: salesToday[0]?.total || 0,
        thisWeek: salesThisWeek[0]?.total || 0,
        thisMonth: salesThisMonth[0]?.total || 0,
        thisYear: salesThisYear[0]?.total || 0
      }
    });
  } catch (err: any) {
    console.log("get_sales_statistics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};