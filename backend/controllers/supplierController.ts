import { Request, Response } from "express";
import Supplier from "../models/Supplier";
import { create_activity_log } from "../services/activityLogServices";
import { AuthenticatedRequest } from "../types/auth";

export const createSupplier = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const isExists = await Supplier.findOne({ email : req.body.email });

        if(isExists){
            res.status(409).json({ success: true, message: 'Supplier already exists'})
            return;
        }

        const newSupplier = new Supplier({...req.body, createdBy: req.user_id});

        await newSupplier.save();

        await create_activity_log({
            supplier_id: newSupplier._id.toString(),
            description: 'created new supplier',
            admin_id: req?.user_id ?? '',
        })

        res.status(201).json({ success: true, newSupplier });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const getSuppliers = async (req :Request, res : Response) => {
    try{
        const searchTerm = req.query?.searchTerm as string ?? '';
        const suppliers = await Supplier.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
            ]
        });

        res.status(200).json({ success: true, suppliers });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const updateSupplier = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const supplier = await Supplier.findById(req.params.id);

        if(!supplier){
            res.status(404).json({ success: false, message: 'Supplier not found'})
            return;
        }

        supplier.set(req.body);

        await supplier.save();

        await create_activity_log({
            supplier_id: supplier._id.toString(),
            description: 'update supplier details',
            admin_id: req?.user_id ?? '',
        })

        res.status(200).json({ success: true, supplier });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}