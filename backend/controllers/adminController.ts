import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { createAdmin, findAdmin } from "../services/userService";
import Admin from "../models/Admin";

export const create_new_admin = async(req: Request, res: Response) => {
    try{
        const admin = await findAdmin({ email: req.body.email });

        if(admin) {
            res.status(409).json({ success: false, message: 'Email already used'});
            return;
        }

        const newUser = await createAdmin(req.body);

        res.status(201).json({ success: true, newUser });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const get_admin= async(req: AuthenticatedRequest, res: Response) => {
    try{
        const admin = await Admin.findById(req.user_id);

        res.status(201).json({ success: true, admin });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const update_admin = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const admin = await findAdmin({ _id: { $ne: id }, email: req.body.email });
        if(admin) {
            res.status(409).json({ success: false, message: "Email already used"});
            return;
        }

        if(req.body.file){

        }

        const updatedAdmin = await Admin.findOneAndUpdate(
            { _id: id }, 
            req.body, 
            { new: true });

        return res.status(200).json({success: true, updatedAdmin});
        
    }catch(err : any){
        return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}