import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Cart from "../models/Cart";

export const create_new_item = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { product_id, customer_id, variant_id, quantity } = req.body;

        const query : any = {
            product_id: product_id,
            customer_id: customer_id
        }

        if(variant_id) query.variant_id = variant_id

        const existedCart = await Cart.findOne(query)

        console.log(quantity)
          
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

export const getCart = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const carts = await Cart.find({ customer_id: req.user_id}).populate('product_id');

        res.status(200).json({ success: true, carts })

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message})
    }
}

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