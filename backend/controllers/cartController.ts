import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Cart from "../models/Cart";


export const getCart = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const carts = await Cart.find({ customer_id: req.user_id}).populate('product_id');

        res.status(200).json({ success: true, carts })

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message})
    }
}