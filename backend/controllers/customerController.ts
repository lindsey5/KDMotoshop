import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Customer from "../models/Customer";


export const getCustomerById = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const customer = await Customer.findById(req.user_id);

        res.status(200).json({ success: true, customer});

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message })
    }
}