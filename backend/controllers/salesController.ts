import { Request, Response } from "express";
import OrderItem from "../models/OrderItem";

export const get_monthly_sales = async (req: Request, res: Response) => {
  try {

    const yearParam = req.query.year as string;
    const year = parseInt(yearParam, 10) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const salesArray = new Array(12);

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
          month: { $month: '$createdAt' },
          netTotal: '$lineTotal'
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

export const get_product_quantity_sold = async (req: Request, res: Response) => {
  try {
    const items = req.query.items as string;
    const skus = items ? items.split(',').filter(item => item.trim() !== '') : [];
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    // Handle month overflow for December
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

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
          createdAt: { $gte: startDate, $lt: endDate },
          sku: skus.length < 1 ? '' : { $in: skus },
          status: { $in: ['Fulfilled', 'Rated'] }
        }
      },
      {
        $group: {
          _id: '$product._id',
          productName: { $first: '$product.product_name' },
          sku: { $first: '$sku' },
          totalQuantitySold: { $sum: '$quantity' },
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          sku: 1,
          totalQuantitySold: 1,
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
    })

    res.status(200).json({ success: true, productSales: productSalesMap });

  } catch (err: any) {
    console.error(err);
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
          'order.status' : { $in: ['Rated', 'Delivered']}
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
          lineTotal: 1,
        }
      },
      {
        $group: {
          _id: '$date',
          total: { $sum: '$lineTotal' }
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