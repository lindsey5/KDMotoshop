import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const get_monthly_sales = async (req: Request, res: Response) => {
  try {
    const yearParam = req.query.year as string;
    const year = parseInt(yearParam, 10) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const salesArray = new Array(12).fill(0);

    const monthlySales = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'order_id',
          foreignField: '_id',
          as: 'order'
        }
      },
      { $unwind: '$order' },
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: ['Fulfilled', 'Rated'] },
          'order.status': { $in: ['Delivered', 'Rated'] }
        }
      },
      {
        $project: {
          month: {
            $dateToParts: { date: '$createdAt', timezone: 'Asia/Manila' } // convert to Asia/Manila
          },
          netTotal: '$lineTotal'
        }
      },
      {
        $group: {
          _id: '$month.month', // extract month from date parts
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

export const get_product_quantity_sold = async (req: Request, res: Response) => {
  try {
    const items = req.query.items as string;
    const skus = items ? items.split(',').filter(item => item.trim() !== '') : [];

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    // Use Asia/Manila timezone for start and end of month
    const startDate = dayjs.tz(`${year}-${month}-01 00:00:00`, 'Asia/Manila').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const productSales = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          ...(skus.length > 0 ? { sku: { $in: skus } } : {}),
          status: { $in: ['Fulfilled', 'Rated'] }
        }
      },
      {
        $group: {
          _id: '$product._id',
          productName: { $first: '$product.product_name' },
          sku: { $first: '$sku' },
          totalQuantitySold: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$lineTotal'] } }
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          sku: 1,
          totalQuantitySold: 1,
          totalRevenue: 1
        }
      }
    ]);

    // Map SKUs to include 0 for missing ones
    const productSalesMap = skus.map(sku => {
      const product = productSales.find(item => item.sku === sku);
      return {
        sku,
        totalQuantitySold: product ? product.totalQuantitySold : 0,
        totalRevenue: product ? product.totalRevenue : 0
      };
    });

    res.status(200).json({ success: true, productSales: productSalesMap });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_sales_per_channel = async (req: Request, res: Response) => {
  try {
    const yearParam = req.query.year as string;
    const year = parseInt(yearParam, 10) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const sales = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
          status: { $in: ["Fulfilled", "Rated"] },
          "order.status": { $in: ["Rated", "Delivered"] }
        }
      },
      {
        $project: {
          month: { $dateToParts: { date: "$createdAt", timezone: "Asia/Manila" } }, // Asia timezone
          lineTotal: 1,
          channel: "$order.order_source"
        }
      },
      {
        $group: {
          _id: { month: "$month.month", channel: "$channel" }, // extract month
          total: { $sum: "$lineTotal" }
        }
      },
      {
        $project: {
          month: "$_id.month",
          channel: "$_id.channel",
          total: 1,
          _id: 0
        }
      }
    ]);

    const channels: { channel: string; sales: number[] }[] = [];

    sales.forEach((s) => {
      let ch = channels.find((c) => c.channel === s.channel);
      if (!ch) {
        ch = { channel: s.channel, sales: new Array(12).fill(0) };
        channels.push(ch);
      }
      ch.sales[s.month - 1] = s.total; // subtract 1 for 0-based index
    });

    res.status(200).json({ success: true, channels });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_daily_sales = async (req: Request, res: Response) => {
  try {
    let { month, year } = req.query;

    // Default to current month/year if not provided
    const now = dayjs().tz('Asia/Manila');
    const monthNum = month ? parseInt(month as string, 10) : now.month() + 1; // 1-12
    const yearNum = year ? parseInt(year as string, 10) : now.year();

    // Create start and end of month in Asia/Manila timezone
    const startOfMonth = dayjs.tz(`${yearNum}-${monthNum}-01 00:00:00`, 'Asia/Manila').toDate();
    const endOfMonth = dayjs(startOfMonth).endOf('month').toDate();

    console.log('StartOfMonth:', startOfMonth);
    console.log('EndOfMonth:', endOfMonth);

    const dailySales = await OrderItem.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'order_id',
          foreignField: '_id',
          as: 'order'
        }
      },
      { $unwind: '$order' },
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['Fulfilled', 'Rated'] },
          'order.status': { $in: ['Rated', 'Delivered'] }
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
          lineTotal: 1
        }
      },
      {
        $group: {
          _id: '$date',
          total: { $sum: '$lineTotal' }
        }
      },
      { $sort: { _id: 1 } },
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
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_sales_statistics = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const startOfToday = now;
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
        $lookup: {
          from: 'orders',
          localField: 'order_id',
          foreignField: '_id',
          as: 'order'
        }
      },
      { $unwind: '$order' },
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["Fulfilled", "Rated"] },
          'order.status' : { $in: ['Rated', 'Delivered']}
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$lineTotal" },
        },
      },
    ];

    const [salesToday, salesThisWeek, salesThisMonth, salesThisYear] =
      await Promise.all([
        OrderItem.aggregate(makeSalesAgg(startOfToday)),
        OrderItem.aggregate(makeSalesAgg(startOfWeek)),
        OrderItem.aggregate(makeSalesAgg(startOfMonth)),
        OrderItem.aggregate(makeSalesAgg(startOfYear)),
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