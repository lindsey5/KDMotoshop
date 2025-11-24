import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";
import { isSuperAdmin } from "../services/adminService";

// Helper: convert to Asia/Manila timezone (UTC+8)
function toManilaTime(date = new Date()) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 8 * 60 * 60000);
}

// Helper: start and end of month in Asia/Manila
function getMonthRange(year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1, -8, 0, 0)); // convert to Manila midnight
  const end = new Date(Date.UTC(year, month, 0, 15, 59, 59)); // last day of month
  return { start, end };
}

export const get_monthly_sales = async (req: Request, res: Response) => {
  try {
    await isSuperAdmin(req, res)
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00+08:00`);
    const end = new Date(`${year + 1}-01-01T00:00:00+08:00`);

    const salesArray = new Array(12).fill(0);

    const monthlySales = await OrderItem.aggregate([
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
          "order.status": { $in: ["Delivered", "Rated"] }
        }
      },
      {
        $project: {
          month: { $month: { date: "$createdAt", timezone: "Asia/Manila" } },
          netTotal: "$lineTotal"
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$netTotal" }
        }
      }
    ]);

    monthlySales.forEach(sale => {
      salesArray[sale._id - 1] = sale.total;
    });

    res.status(200).json({ success: true, monthlySales: salesArray });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_product_quantity_sold = async (req: Request, res: Response) => {
  try {
    await isSuperAdmin(req, res)
    const items = req.query.items as string;
    const skus = items ? items.split(",").filter(item => item.trim() !== "") : [];

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const { start, end } = getMonthRange(year, month);

    const productSales = await OrderItem.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          ...(skus.length > 0 ? { sku: { $in: skus } } : {}),
          status: { $in: ["Fulfilled", "Rated"] }
        }
      },
      {
        $group: {
          _id: "$product._id",
          productName: { $first: "$product.product_name" },
          sku: { $first: "$sku" },
          totalQuantitySold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$lineTotal" }
        }
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          sku: 1,
          totalQuantitySold: 1,
          totalRevenue: 1
        }
      }
    ]);

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
    await isSuperAdmin(req, res)
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00+08:00`);
    const end = new Date(`${year + 1}-01-01T00:00:00+08:00`);

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
          month: { $month: { date: "$createdAt", timezone: "Asia/Manila" } },
          lineTotal: 1,
          channel: "$order.order_source"
        }
      },
      {
        $group: {
          _id: { month: "$month", channel: "$channel" },
          total: { $sum: "$lineTotal" }
        }
      }
    ]);

    const channels: { channel: string; sales: number[] }[] = [];

    sales.forEach(s => {
      let ch = channels.find(c => c.channel === s._id.channel);
      if (!ch) {
        ch = { channel: s._id.channel, sales: new Array(12).fill(0) };
        channels.push(ch);
      }
      ch.sales[s._id.month - 1] = s.total;
    });

    res.status(200).json({ success: true, channels });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_daily_sales = async (req: Request, res: Response) => {
  try {
    await isSuperAdmin(req, res)
    const now = toManilaTime();
    const month = parseInt(req.query.month as string) || now.getMonth() + 1;
    const year = parseInt(req.query.year as string) || now.getFullYear();
    const { start, end } = getMonthRange(year, month);

    const dailySales = await OrderItem.aggregate([
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
          createdAt: { $gte: start, $lte: end },
          status: { $in: ["Fulfilled", "Rated"] },
          "order.status": { $in: ["Rated", "Delivered"] }
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
          _id: "$date",
          total: { $sum: "$lineTotal" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
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
    await isSuperAdmin(req, res)
    const now = toManilaTime();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const makeSalesAgg = (startDate: Date) => [
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
          createdAt: { $gte: startDate },
          status: { $in: ["Fulfilled", "Rated"] },
          "order.status": { $in: ["Rated", "Delivered"] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$lineTotal" }
        }
      }
    ];

    const [salesToday, salesThisWeek, salesThisMonth, salesThisYear] = await Promise.all([
      OrderItem.aggregate(makeSalesAgg(startOfToday)),
      OrderItem.aggregate(makeSalesAgg(startOfWeek)),
      OrderItem.aggregate(makeSalesAgg(startOfMonth)),
      OrderItem.aggregate(makeSalesAgg(startOfYear))
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

/*
export const getSalesBetweenMonths = async (req: Request, res: Response)=> {
  try {
    const startYear = parseInt(req.query.startYear as string);
    const startMonth = parseInt(req.query.startMonth as string);
    const endYear = parseInt(req.query.endYear as string);
    const endMonth = parseInt(req.query.endMonth as string);

    if (!startYear || !startMonth || !endYear || !endMonth) {
      res.status(400).json({ success: false, message: 'Missing start or end month/year' });
      return;
    }

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0, 23, 59, 59, 999);

    const salesAgg = await OrderItem.aggregate([
      {
        $match: {
          status: 'Fulfilled',
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          totalSales: { $sum: '$lineTotal' },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          totalSales: 1,
          totalQuantity: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const allDates: { date: string; totalSales: number; totalQuantity: number }[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      allDates.push({ date: `${yyyy}-${mm}-${dd}`, totalSales: 0, totalQuantity: 0 });
    }

    const salesMap = new Map(
      salesAgg.map((s) => [s.date.toISOString().slice(0, 10), s])
    );

    allDates.forEach((d) => {
      if (salesMap.has(d.date)) {
        const s = salesMap.get(d.date)!;
        d.totalSales = s.totalSales;
        d.totalQuantity = s.totalQuantity;
      }
    });

    res.status(200).json({ success: true, sales: allDates });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
*/