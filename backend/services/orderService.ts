import Cart from "../models/Cart";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
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

    product.markModified('variants');
    await product.save();
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

export const createNewOrder = async ({ orderItems, order, cart } : { orderItems : OrderItem[], order: Order, cart?: ICart[]}) : Promise<any> => {
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

        if(customer.customer_id){
            await sendAdminsNotification({
                from: customer.customer_id.toString(),
                order_id: savedOrder._id as string,
                content: `New order placed by ${customer.firstname} ${customer.lastname}`
            });
        }

        return savedOrder
    }catch(err : any){
        console.log(err)
        return null
    }
}

export const getProductDailyDemand = async (product_id: string, variant_sku?: string) => {

    const match: any = {
        product_id: new Types.ObjectId(product_id),
        status: { $in: ['Fulfilled', 'Rated'] },
    };

    if (variant_sku) {
        match.sku = variant_sku;
    }

    const dailySales = await OrderItem.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $limit: 30 }, 
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
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }, // sort by date ascending
    ]);

    return dailySales;
};

export const getDailySalesLength = async (id : string, product_type: string,sku?: string) => {
  let dailySales;
  if (product_type === 'Variable' && sku) {
    dailySales = await getProductDailyDemand(id, sku);
  } else {
     dailySales = await getProductDailyDemand(id);
  }
  return dailySales.length
}