import Cart from "../models/Cart";
import Order, { IOrder } from "../models/Order";
import OrderItem, { IOrderItem } from "../models/OrderItem";
import Product from "../models/Product";
import { ICart } from "../models/Cart";
import { sendAdminsNotification } from "./notificationService";
import { sendLowStockAlert } from "./alertService";
import { Types } from "mongoose";

export const generateOrderId = async () : Promise<string> => {
  const prefix = 'ORD-';
  const order_id = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const existingOrder = await Order.findOne({ order_id });

  // If it exists, retry
  if (existingOrder) {
    return generateOrderId();
  }

  return order_id;
};

export const decrementStock = async (item: any) => {
  const product = await Product.findById(item.product_id);
  if (!product) return;

  if (item.product_type === 'Variable') {
    // Decrement variant stock
    await Product.updateOne(
      { _id: item.product_id, 'variants.sku': item.sku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );

    const variant = product.variants.find(v => v.sku === item.sku);
    if (!variant) return;

    const currentStock = variant.stock;
    const newStock = currentStock - item.quantity;
    variant.stock = newStock;

    product.markModified('variants');
    await product.save();

    const { status, amount } = await product.getStockStatus(variant.sku);

    if (status === 'Understock' || status === 'Out of Stock') {
      await sendLowStockAlert(
        product._id as string,
        product.product_name,
        product.thumbnail.imageUrl,
        variant.sku,
        newStock,
        currentStock,
        amount
      );
    }

  } else {
    // Simple product
    await Product.updateOne(
      { _id: item.product_id },
      { $inc: { stock: -item.quantity } }
    );

    const currentStock = product.stock ?? 0;
    const newStock = currentStock - item.quantity;
    product.stock = newStock;
    await product.save();
    const { status, amount } = await product.getStockStatus();

    if (status === 'Understock' || status === 'Out of Stock') {
      await sendLowStockAlert(
        product._id as string,
        product.product_name,
        product.thumbnail.imageUrl,
        product.sku ?? '',
        newStock,
        currentStock,
        amount
      );
    }
  }
};

export const createNewOrder = async ({ orderItems, order, cart } : { orderItems : IOrderItem[], order: IOrder, cart?: ICart[]}) : Promise<any> => {
    try{
        const newOrder = new Order(order);

        const orderItemsWithOrderID = orderItems.map((item: any) => (
            {
                ...item, 
                order_id: newOrder._id,
                status: order.status === 'Delivered' ? 'Fulfilled' : 'Unfulfilled'
            }
        ));   

        await OrderItem.insertMany(orderItemsWithOrderID)
            .then(async (items) => {
                if(newOrder.status === 'Delivered') {
                    for (const item of items) await decrementStock(item)
                }
            })  
            .catch((error) => {
                throw new Error(`Failed to save order items: ${error.message}`);
        });

        if(cart){
            for(const item of cart){
                await Cart.findByIdAndDelete(item._id);
            }
        }

        const savedOrder = await newOrder.save();

        const customer = order.customer

        if(customer?.customer_id){
            await sendAdminsNotification({
                notificationData: {
                  from: customer?.customer_id.toString(),
                  order_id: savedOrder._id as string,
                  content: `New order placed by ${customer?.firstname} ${customer?.lastname}`
              }
            });
        }

        return savedOrder
    }catch(err : any){
        console.log(err)
        return null 
    }
}

/*
export const getProductDailyDemand = async (product_id: string, variant_sku?: string) => {
    const matchBase: any = {
        product_id: new Types.ObjectId(product_id),
        status: { $in: ['Fulfilled', 'Rated'] }
    };

    if (variant_sku) {
        matchBase.sku = variant_sku;
    }

    const firstOrder = await OrderItem.findOne(matchBase)
        .sort({ createdAt: 1 })
        .select("createdAt");

    if (!firstOrder) {
        const result: any[] = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            result.push({
                date: d.toISOString().split("T")[0],
                totalQuantity: 0
            });
        }
        return result.reverse();
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startDate = firstOrder.createdAt > thirtyDaysAgo
        ? firstOrder.createdAt
        : thirtyDaysAgo;

    const match: any = {
        ...matchBase,
        createdAt: { $gte: startDate }
    };

    const dailySales = await OrderItem.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                },
                totalQuantity: { $sum: '$quantity' },
            },
        }
    ]);

    const salesMap = new Map();
    dailySales.forEach(item => {
        const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
        salesMap.set(key, item.totalQuantity);
    });

    const result: { date: string; totalQuantity: number }[] = [];
    let loopDate = new Date();

    while (loopDate >= startDate) {
        const key = `${loopDate.getFullYear()}-${loopDate.getMonth() + 1}-${loopDate.getDate()}`;
        const qty = salesMap.get(key) || 0;

        result.push({
            date: loopDate.toISOString().split("T")[0],
            totalQuantity: qty
        });

        loopDate.setDate(loopDate.getDate() - 1);
    }

    return result.reverse();
};
*/

export const getProductDailyDemand = async (product_id: string, variant_sku?: string) => {

    const match: any = {
        product_id: new Types.ObjectId(product_id),
        status: { $in: ['Fulfilled', 'Rated'] },
        createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        }
    };

    if (variant_sku) {
        match.sku = variant_sku;
    }

    const dailySales = await OrderItem.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                },
                totalQuantity: { $sum: '$quantity' },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
    ]);

    return dailySales;
};