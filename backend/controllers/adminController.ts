import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { createAdmin, findAdmin, isSuperAdmin } from "../services/adminService";
import Admin from "../models/Admin";
import { deleteImage, uploadImage } from "../services/cloudinary";
import { create_activity_log } from "../services/activityLogServices";
import { isStrongPassword, verifyPassword } from "../utils/authUtils";
import { logoutUser } from "../middlewares/socket";
import { Types } from "mongoose";

export const create_new_admin = async(req: AuthenticatedRequest, res: Response) => {
    try{
        await isSuperAdmin(req, res)
        const admin = await findAdmin({ email: req.body.email });

        if(admin && admin.status === 'Active') {
            res.status(409).json({ success: false, message: 'Email already used'});
            return;
        }

        let newUser;

        if(admin.status === 'Inactive'){
            admin.set(req.body);
            admin.status = 'Active';
            await admin.save();
            newUser = admin;
        }else{
            newUser = await createAdmin(req.body);
        }

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
        const updatedData = req.body;
        const id = req.params.id;

        const super_admin = await Admin.findOne({ _id: id})
        if(super_admin && super_admin.role === 'Super Admin'){
            res.status(403).json({ success: false, message: 'Access Denied: You are not a Super Admin' });
            return;
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

        admin.set(updatedData);
        await admin.save();

        await create_activity_log({
            admin_id: req.user_id ?? '',
            description: `updated ${admin.firstname} ${admin.lastname} details`
        });

        res.status(200).json({success: true, updatedAdmin: admin });
        
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
        const { password } = updatedData;

        if(password && !isStrongPassword(password)){
            res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.' })
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
        admin.set(updatedData);
        await admin.save();

        res.status(200).json({success: true, updatedAdmin: admin, message: 'Your profile information has been successfully updated.'});
        
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
        const query: any = { _id: { $ne: req.user_id }, status: 'Active' };
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

export const changeAdminPassword = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findById(req.user_id);

        if(!admin){
            res.status(404).json({ success: false, message: 'Admin not found.'});
            return;
        }

        if(!await verifyPassword(currentPassword, admin.password)){
            res.status(401).json({ success: false, message: 'Your current password is incorrect'})
            return;
        }

        if(!isStrongPassword(newPassword)){
            res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.'})
            return;
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ success: true, message: 'Password has been changed successfully!'});

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const deleteAdmin = async (req : AuthenticatedRequest, res : Response) => {
    try{
        const isSuperAdmin = await Admin.findOne({ _id: req.user_id, role: 'Super Admin'});

        if(!isSuperAdmin){
            res.status(401).json({ success: false, message: 'Unauthorized.'});
            return;
        }

        const admin = await Admin.findById(req.params.id);

        if(!admin){
            res.status(404).json({ success: false, message: 'Admin not found'});
            return;
        }

        admin.status = "Inactive";
        await admin.save();
        await logoutUser((admin._id as Types.ObjectId).toString());
        res.status(200).json({ success: true, message: 'Admin successfully deleted'});

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}