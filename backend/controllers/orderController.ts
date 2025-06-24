import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import { AuthenticatedRequest } from '../types/auth';
import Product from '../models/Product';

const generateOrderId = async () => {
  const prefix = 'ORD-';
  const order_id = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const existingOrder = await Order.findOne({ order_id });

  // If it exists, retry
  if (existingOrder) {
    return generateOrderId();
  }

  return order_id;
};

const decrementStock = async (item : any) => {
    if (item.variant_id) {
        await Product.updateOne(
            {  _id: item.product_id,  "variants._id": item.variant_id },
            { $inc: { "variants.$.stock": -item.quantity } }
        );
    } else {
        await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } }
        );
    }
}

export const create_order = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { order, orderItems } = req.body;
        if (!order || !orderItems) {
            res.status(400).json({ success: false, message: 'Order and order items are required' });
            return;
        }
        const newOrder = new Order({...order, createdBy: req.user_id, order_id: await generateOrderId()});

        const orderItemsWithOrderID = orderItems.map((item: any) => ({...item, order_id: newOrder._id}));   
        OrderItem.insertMany(orderItemsWithOrderID)
            .then(async (items) => {
                const savedOrder = await newOrder.save();
                if(newOrder.status === 'Completed') {
                    for (const item of items) await decrementStock(item)
                }
                res.status(201).json({ success: true, order: savedOrder });
            })  
            .catch((error) => {
                throw new Error(`Failed to save order items: ${error.message}`);
            });
                
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const get_orders = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm as string | undefined;
    const status = req.query.status as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    try {
        let filter: any = {};
        if (searchTerm) {
            filter.$or = [
                { order_id: { $regex: searchTerm, $options: 'i' } },
                { 'customer.firstname': { $regex: searchTerm, $options: 'i' } },
                { 'customer.lastname': { $regex: searchTerm, $options: 'i' } },
                { payment_method: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (status && status !== 'All') filter.status = status;

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } 
        else if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        else if (endDate)  filter.createdAt = { $lte: new Date(endDate) };

        const [orders, totalOrders] = await Promise.all([
            Order.find(filter)
                .skip(skip)
                .limit(limit)
                .populate({ path: 'customer.customer_id' })
                .sort({ createdAt: -1 }),
            Order.countDocuments(filter),
        ]);
            

        res.status(200).json({ 
            success: true, 
            orders,
            page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const get_orders_statistics = async (req: Request, res: Response) => {
    try {
        const last365Days = new Date();
        last365Days.setFullYear(last365Days.getFullYear() - 1);

        const [overallTotalOrders, pendingOrders, completedOrders, cancelledOrders] = await Promise.all([ 
            Order.countDocuments({ createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: 'Pending', createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: 'Completed', createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: 'Cancelled', createdAt: { $gte: last365Days } })
        ]);

        res.status(200).json({ 
            success: true,  
            overallTotalOrders,
            pendingOrders,
            completedOrders,
            cancelledOrders
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}