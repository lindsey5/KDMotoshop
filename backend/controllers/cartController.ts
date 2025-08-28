import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Cart from "../models/Cart";

export const create_new_item = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { product_id, customer_id, sku, quantity } = req.body;

        const query : any = {
            product_id: product_id,
            customer_id: customer_id,
            sku: sku,
        }

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
        console.log('Error in create_new_item:', err);
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

        // Build response
        const completedCart = carts.map((item) => {
            const product: any = item.product_id;

            const variant = product.variants?.find((v: any) => v.sku === item.sku);
            const stock = product.product_type === 'Single' ? product.stock : variant?.stock || 0

            if(stock === 0){
                return null
            }

            return {
                _id: item._id,
                customer_id: item.customer_id,
                product_id: product._id,
                product_type: item.product_type,
                sku: item.sku,
                quantity: item.quantity,
                attributes: variant?.attributes || [],
                stock,
                product_name: product.product_name,
                price: product.product_type === 'Single' ? product.price : variant?.price || 0,
                image: product.thumbnail?.imageUrl || ''
            };
        }).filter(c => c)

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