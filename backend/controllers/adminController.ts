import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { createAdmin, findAdmin } from "../services/adminService";
import Admin from "../models/Admin";
import { deleteImage, uploadImage } from "../services/cloudinary";
import { create_activity_log } from "../services/activityLogServices";
import { hashPassword } from "../utils/authUtils";

export const create_new_admin = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const isSuperAdmin = await findAdmin({ _id: req.user_id, role: 'Super Admin'})

        if(!isSuperAdmin){
            res.status(403).json({ success: false, message: 'Access Denied: You are not a Super Admin' });
            return;
        }

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
        const admin = await Admin.findById(req.user_id).select(['-password']);

        res.status(201).json({ success: true, admin });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const update_admin = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const { _id: id, ...updatedData } = req.body;

        const isSuperAdmin = await findAdmin({ _id: req.user_id, role: 'Super Admin'})

        if(!isSuperAdmin){
            res.status(403).json({ success: false, message: 'Access Denied: You are not a Super Admin' });
            return;
        }

        if(updatedData?.password) {
            updatedData.password = await hashPassword(updatedData.password);
        }

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

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, { new: true });

        await create_activity_log({
            admin_id: req.user_id ?? '',
            description: `updated ${admin.firstname} ${admin.lastname} details - (${admin.role})`
        });

        res.status(200).json({success: true, updatedAdmin});
        
    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const update_admin_profile = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const id = req.body._id;
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
            await deleteImage(image.imagePublicId);
            image = await uploadImage(updatedData.image);
            updatedData.image = image;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({success: true, updatedAdmin});
        
    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const get_all_admins = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const searchTerm = req.query.search as string | undefined;
        const isSuperAdmin = await findAdmin({ _id: req.user_id, role: 'Super Admin' });

        if(!isSuperAdmin) {
            res.status(403).json({ success: false, message: 'Access Denied: You are not a Super Admin' });
            return;
        }
        const query: any = { _id: { $ne: req.user_id } };
        if (searchTerm) {
            query.$or = [
                { email: { $regex: searchTerm, $options: 'i' } },
                { firstname: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const admins = await Admin.find(query).select('-password').sort({ createdAt: -1 });

        res.status(200).json({ success: true, admins });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}