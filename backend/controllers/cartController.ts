import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Cart from "../models/Cart";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";

export const create_new_item = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { product_id, customer_id, variant_id, quantity } = req.body;

        const query : any = {
            product_id: product_id,
            customer_id: customer_id
        }

        if(variant_id) query.variant_id = variant_id

        const existedCart = await Cart.findOne(query)
          
        if(existedCart){
            existedCart.quantity += quantity;
            await existedCart.save();
            res.status(201).json({ success: true, cart: existedCart});
            return;
        }
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json({ success: true, cart: newCart});
    }catch(err : any){
        res.status(500).json({ success: false, message: err.message})
    }
}

export const updateCart = async (req : Request, res: Response) => {
    try{
        const { id } = req.params;
        const updatedCart = await Cart.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );

        if(!updatedCart){
            res.status(404).json({ success: false, message: "Cart doesn`t exist"})
        }

        res.status(200).json({ success: true, updatedCart})        

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message})
    }
}

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const carts = await Cart.find({ customer_id: req.user_id }).populate('product_id');

        // Get all accepted order IDs only once
        const orders = await Order.find({ status: 'Accepted' }, '_id');
        const orderIds = orders.map(order => order._id);

        // Get all orderItems for those orders (all products)
        const orderItems = await OrderItem.find({ order_id: { $in: orderIds } });

        // Build stock map
        const stockMap = new Map<string, number>();
        orderItems.forEach(item => {
            const key = item.product_id.toString() + (item.variant_id?.toString() || '');
            stockMap.set(key, (stockMap.get(key) || 0) + item.quantity);
        });

        // Build response
        const completedCart = await Promise.all(
            carts.map(async (item) => {
                const product: any = item.product_id;

                // Use .equals or .toString() to compare ObjectIds
                const variant = product.variants?.find((v: any) => v._id.toString() === item.variant_id?.toString());

                // Adjust stock
                if (product.product_type === 'Single') {
                    const key = product._id.toString();
                    const orderedQty = stockMap.get(key) || 0;
                    product.stock = Math.max((product.stock || 0) - orderedQty, 0);
                } else {
                    product.variants?.forEach((v: any) => {
                        const varKey = product._id.toString() + v._id.toString();
                        const varOrderedQty = stockMap.get(varKey) || 0;
                        v.stock = Math.max((v.stock || 0) - varOrderedQty, 0);
                    });
                }

                return {
                    _id: item._id,
                    customer_id: item.customer_id,
                    product_id: product._id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    attributes: variant?.attributes || [],
                    stock: product.product_type === 'Single' ? product.stock : variant?.stock || 0,
                    product_name: product.product_name,
                    price: product.product_type === 'Single' ? product.price : variant?.price || 0,
                    image: product.thumbnail?.imageUrl || ''
                };
            })
        );

        res.status(200).json({ success: true, carts: completedCart });
    } catch (err: any) {
        console.log('Error in getCart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const delete_cart_item = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            res.status(409).json({ success: false, message: 'Cart item does not exist' });
            return;
        }

        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Cart item deleted successfully' });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};