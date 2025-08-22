import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import { AuthenticatedRequest } from '../types/auth';
import { createNewOrder, generateOrderId } from '../services/orderService';
import { decrementStock } from '../services/orderService';
import { sendAdminsNotification, sendCustomerNotification } from '../services/notificationService';
import { create_activity_log } from '../services/activityLogServices';
import Payment from '../models/Payment';
import { refundPayment } from '../services/paymentService';
import { sendOrderUpdate } from '../services/emailService';

export const create_order = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { order, orderItems } = req.body;
        if (!order || !orderItems) {
            res.status(400).json({ success: false, message: 'Order and order items are required' });
            return;
        }
        const newOrder = {...order, createdBy: req.user_id, order_id: await generateOrderId()}

        const savedOrder = await createNewOrder({ orderItems, order: newOrder });

        if(!savedOrder) {
            res.status(400).json({ success: false, message: 'Creating order error'});
            return;
        }

        await create_activity_log({
            admin_id: req.user_id ?? '',
            description: 'created a new order',
            order_id: savedOrder._id as string
        })

        res.status(201).json({ success: true, order: savedOrder });
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
}

export const create_customer_order = async (req: Request, res: Response) => {
    try {
        const { order, orderItems, cart } = req.body;
        if (!order || !orderItems) {
            res.status(400).json({ success: false, message: 'Order and order items are required' });
            return;
        }
        const newOrder = {...order, order_id: await generateOrderId()}

        const cartToDelete = Array.isArray(cart) ? cart : [];
        const savedOrder = await createNewOrder({ orderItems, order: newOrder, cart: cartToDelete });
        if(!savedOrder) {
            res.status(400).json({ success: false, message: 'Creating order error'});
            return;
        }

        res.status(201).json({ success: true, order: savedOrder });
    } catch (err: any) {
        console.log(err)
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
    const payment_method = req.query.payment_method as string | undefined;
    const from = req.query.from as string | undefined;
    
    try {
        let filter: any = {};
        if (searchTerm) {
            filter.$or = [
                { order_id: { $regex: searchTerm, $options: 'i' } },
                { 'customer.firstname': { $regex: searchTerm, $options: 'i' } },
                { 'customer.lastname': { $regex: searchTerm, $options: 'i' } },
                { order_source: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (status && status !== 'All') filter.status = status;

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000))
            };
        } 
        else if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        else if (endDate)  filter.createdAt = { $lte: new Date(new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)) };

        if(payment_method && payment_method !== 'All'){
            filter.payment_method = payment_method
        }

        if(from) filter.order_source = from

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

        const [overallTotalOrders, pendingOrders, deliveredOrders, cancelledOrders] = await Promise.all([ 
            Order.countDocuments({ createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: 'Pending', createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: { $in: ['Delivered', 'Rated']}, createdAt: { $gte: last365Days } }),
            Order.countDocuments({ status: 'Cancelled', createdAt: { $gte: last365Days } })
        ]);

        res.status(200).json({ 
            success: true,  
            overallTotalOrders,
            pendingOrders,
            deliveredOrders,
            cancelledOrders
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const get_order_by_id = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('customer.customer_id', 'image.imageUrl')
        .populate('createdBy');

        if(!order){
            res.status(404).json({ success: false, message: 'Order not found'})
            return;
        }

        const orderItems = await OrderItem.find({ order_id: order._id })
        .populate([
            { path: "product_id" },
            {
            path: "refund",
            populate: [
                {
                path: "order_item_id",
                populate: [
                    { path: "order_id" },
                    { path: "product_id", select: "product_name thumbnail" }
                ]
                }
            ]
            }
        ]);

        const formattedItems = orderItems.map(item => {
            const { product_id, ...rest } = item.toObject();

            return {
                ...rest,
                product_id: (product_id as any)._id,
                image: (product_id as any)?.thumbnail?.imageUrl || null
            };
        });

        res.status(200).json({ 
            success: true,  
            order: { ...order.toObject(), orderItems: formattedItems }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const update_order = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id); 

        if(!order){
            res.status(404).json({ success: false, message: 'Order not found'});
            return;
        }

        if (
            order.status === 'Cancelled' || 
            order.status === 'Rejected' || 
            order.status === 'Refunded' 
        ) {
            res.status(400).json({
                success: false,
                message: `This order is already ${order.status.toLowerCase()} and cannot be modified.`
            });
            return;
        }

        if(req.body.status === 'Cancelled' || req.body.status === 'Rejected'){
            const payment = await Payment.findOne({ order_id: id});
        
            if(payment && payment.status === 'Paid'){
                const refund = await refundPayment(payment.payment_id as string, order.total * 100)

                if(!refund) throw new Error('Update Error')
                payment.status = 'Refunded'
                await payment.save()
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );

        /*if(req.body.status !== 'Delivered'){
            for (const item of req.body.orderItems) {
                if((order.status === 'Shipped' || order.status === 'Delivered') && req.body !== 'Refunded') await incrementStock(item)
                if(req.body.status === 'Pending'){
                    await OrderItem.updateOne({_id: item._id}, { status: 'Unfulfilled' });
                }else if(req.body.status === 'Refunded'){
                    await OrderItem.updateOne({_id: item._id}, { status: 'Refunded' });
                }else if(req.body.status === 'Cancelled'){
                    await OrderItem.updateOne({_id: item._id}, { status: 'Cancelled' });
                }else if(req.body.status === 'Failed'){
                    await OrderItem.updateOne({_id: item._id}, { status: 'Failed' });
                }
            }
        }*/
        
        if(req.body.status === 'Delivered' || req.body.status === 'Shipped'){
            for (const item of req.body.orderItems) {
                if(order.status !== 'Delivered' && order.status !== 'Shipped') await decrementStock(item)
                await OrderItem.updateOne({_id: item._id}, { status: 'Fulfilled' });
            }
        }

        if(req.body.status !== order.status) {
            if(order.customer.customer_id) {
                await sendCustomerNotification(
                    order.customer?.customer_id?.toString() || '', 
                    order._id as string, 
                    `${order.order_id} has been updated to ${req.body.status}`,
                );
            }
            await create_activity_log({
                admin_id: req.user_id ?? '',
                description: `updated ${order.order_id}`,
                order_id: id,
                prev_value: order.status,
                new_value: req.body.status,
            })
        }

        if(order.customer.customer_id) await sendOrderUpdate(order.customer.email as string, order.order_id, order.customer.firstname, req.body.status);

        res.status(200).json({ 
            success: true,  
            order: updatedOrder
        });
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
}

export const get_customer_orders = async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    try {
        let filter: any = {
            'customer.customer_id': req.user_id
        };

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

        const orderWithItems = await Promise.all(orders.map(async (order) => {
            const orderItems = await OrderItem.find({ order_id: order._id })
            .populate('product_id');

            const formattedItems = orderItems.map(item => {
                const { product_id, ...rest } = item.toObject();

                return {
                    ...rest,
                    product_id: (product_id as any)._id,
                    image: (product_id as any)?.thumbnail?.imageUrl || null
                };
            });
            return { ...order.toObject(), orderItems: formattedItems }
        }))

        res.status(200).json({ 
            success: true, 
            orders: orderWithItems,
            page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const cancel_order = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if(!order){
            res.status(404).json({ success: false, message: 'Order not found'});
            return;
        }

        if(order.status !== 'Pending' && order.status !== 'Confirmed'){
            res.status(400).json({ success: false, message: 'Order cannot be cancel'});
            return;
        }

        order.status = 'Cancelled'

        const payment = await Payment.findOne({ order_id: order._id});
        
        if(payment && payment.status === 'Paid'){
            const refund = await refundPayment(payment.payment_id as string, order.total * 100)

            if(!refund) throw new Error('Cancellation Error')

            payment.status = 'Refunded'
            await payment.save()
        }

        const orderItems = await OrderItem.find({ order_id: order._id});

        for (const item of orderItems) {
            await OrderItem.updateOne({_id: item._id}, { status: 'Cancelled' });
        }

        await order.save();

        const customer = order.customer
        if(customer.customer_id){
            await sendAdminsNotification({
                from: customer.customer_id?.toString(), 
                order_id: order._id as string, 
                content: `Order ${order.order_id} has been cancelled`
            })
        }

        res.status(200).json({ 
            success: true,  
            order
        });
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getOrderItem = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        const orderItem = await OrderItem.findById(id).populate('product_id');

        if(!orderItem){
            res.status(404).json({ success: false, message: 'Order Item not found'});
            return;
        }

        res.status(200).json({ success: true, orderItem});

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message });
    }
}