import { Request, RequestHandler, Response } from "express";
import * as userService from "../services/userService";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/auth";

export const create_new_user = async(req: Request, res: Response) => {
    try{
        const user = await userService.findUser({ email: req.body.email });

        if(user) {
            res.status(409).json({ success: false, message: 'Email already used'});
            return;
        }

        const newUser = await userService.createUser(req.body);

        res.status(201).json({ success: true, newUser });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const get_user = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const user = await User.findById(req.user_id);

        res.status(201).json({ success: true, user });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const update_user = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const user = await userService.findUser({ _id: { $ne: id }, email: req.body.email });
        if(user) {
            res.status(409).json({ success: false, message: "Email already used"});
            return;
        }

        if(req.body.file){

        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, 
            req.body, 
            { new: true });

        return res.status(200).json({success: true, updatedUser});
        
    }catch(err : any){
        return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}