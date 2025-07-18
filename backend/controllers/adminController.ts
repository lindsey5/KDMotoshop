import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { createAdmin, findAdmin } from "../services/userService";
import Admin from "../models/Admin";
import { deleteImage, uploadImage } from "../services/cloudinary";

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

export const update_admin = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const id = req.user_id;
        const updatedData = req.body;

        const isEmailExist = await findAdmin({ _id: { $ne: id }, email: req.body.email });
        if(isEmailExist) {
            res.status(409).json({ success: false, message: "Email already used"});
            return;
        }

        const admin = await Admin.findById(id);

        if(!admin){
            res.status(404).json({success: false, message: 'Admin not found'})
            return;
        }

        let image : any = admin.image;

        if (typeof updatedData.image === 'string') {
            if (image && typeof image !== 'string') {
                await deleteImage(image.imagePublicId);
            }
            image = await uploadImage(updatedData.image);
            updatedData.image = image;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({success: true, updatedAdmin});
        
    }catch(err : any){
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}