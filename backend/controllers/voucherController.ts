import { Request, Response } from "express";
import Voucher from "../models/Voucher";
import { AuthenticatedRequest } from "../types/auth";
import Order from "../models/Order";

export const createVoucher = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const isExist = await Voucher.findOne({ code: req.body.code, status: 'Active' });
        if(isExist){
            res.status(409).json({ success: false, message: 'Code already exists.'});
            return;
        }

        const voucher = await Voucher.create({...req.body, createdBy: req.user_id });

        res.status(201).json({ success: true, message: 'Voucher successfully created.', voucher });

    }catch(err : any){
        res.status(500).json({ success: false, message: err?.message || 'Server Error'})
    }
}

export const getVouchers = async (req : Request, res: Response) => {
    try{
        const status = req.query.status as string | undefined;
        const searchTerm = req.query.searchTerm as string | undefined;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        let query : any = {};

        if(status){
            query.endDate = status === 'Active' ? { $gt: new Date() } : { $lt: new Date() };
        }

        if(searchTerm){
            query.$or = [
                { code: { $regex: searchTerm, $options: 'i' } }, 
                { name: { $regex: searchTerm, $options: 'i' }}
            ]
        }

        const [vouchers, totalVouchers] = await Promise.all([
            Voucher.find(query)
            .populate('createdBy')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            ,
            Voucher.countDocuments(query)
        ])

        res.status(200).json({ 
            success: true, 
            vouchers,
            page,
            totalPages: Math.ceil(totalVouchers / limit),
            totalVouchers,
        })

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server Error'});
    }
}

export const checkIfVoucherValid = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { code, total } = req.query;
        const voucher = await Voucher.findOne({
            code, 
            endDate: { $gt: new Date() }
        })

        if(!voucher){
            res.status(404).json({ success: false, message: 'Voucher not exists.'})
            return;
        }

        if (Number(total) <= voucher.minSpend) {
            res.status(400).json({ 
                success: false, 
                message: `The total amount must be greater than ₱${voucher.minSpend} to use this voucher.` 
            });
            return;
        }

        const usedOrders = await Order.find({
            voucher: voucher._id,
            'customer.customer_id' : req.user_id
        })

        if(usedOrders.length >= voucher.usageLimit){
            res.status(403).json({ success: false, message: 'You have already used this voucher the maximum allowed times' });
            return;
        }

        res.status(200).json({ success: true, voucher });
    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server Error'});
    }
}