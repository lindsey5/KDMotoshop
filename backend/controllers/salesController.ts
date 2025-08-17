import { Request, Response } from "express";
import Order from "../models/Order";

export const get_monthly_sales = async (req: Request, res: Response) => {
  try {
    await Order.updateMany({ status: 'Refunded' }, { $set: { status: 'Cancelled' } });

    const yearParam = req.query.year as string;
    const year = parseInt(yearParam, 10) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const salesArray = new Array(12);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: ['Delivered', 'Rated'] }
        }
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          netTotal: '$total'
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$netTotal' }
        }
      },
      {
        $project: {
          month: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    monthlySales.forEach(sale => {
      salesArray[sale.month - 1] = sale.total;
    });

    res.status(200).json({ success: true, monthlySales: salesArray });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_daily_sales = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ success: false, message: 'Month and year are required' });
      return;
    }

    const monthNum = parseInt(month as string, 10);
    const yearNum = parseInt(year as string, 10);

    // Create date range for the given month and year
    const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endOfMonth = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['Delivered', 'Rated'] }
        }
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Manila"
            }
          },
          netTotal: '$total'
        }
      },
      {
        $group: {
          _id: '$date',
          total: { $sum: '$netTotal' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ success: true, dailySales });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_sales_statistics = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    // Start of today in local time
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of the week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday
    const diff = day === 0 ? 6 : day - 1; // Monday = start
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of the month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of the year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const makeSalesAgg = (startDate: Date) => [
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["Delivered", "Rated"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ];

    const [salesToday, salesThisWeek, salesThisMonth, salesThisYear] =
      await Promise.all([
        Order.aggregate(makeSalesAgg(startOfToday)),
        Order.aggregate(makeSalesAgg(startOfWeek)),
        Order.aggregate(makeSalesAgg(startOfMonth)),
        Order.aggregate(makeSalesAgg(startOfYear)),
      ]);

    res.status(200).json({
      success: true,
      data: {
        today: salesToday[0]?.total || 0,
        thisWeek: salesThisWeek[0]?.total || 0,
        thisMonth: salesThisMonth[0]?.total || 0,
        thisYear: salesThisYear[0]?.total || 0,
      },
    });
  } catch (err: any) {
    console.log("get_sales_statistics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};