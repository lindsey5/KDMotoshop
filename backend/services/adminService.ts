import { FilterQuery } from "mongoose";
import Admin, { IAdmin } from "../models/Admin"
import { AuthenticatedRequest } from "../types/auth";
import { Response } from "express";

// Service to create a new user and save it to the database
export const createAdmin = async (userData : Partial<IAdmin>) : Promise<IAdmin> => {
    const newUser = new Admin(userData); // Create a new user instance
    return await newUser.save(); // Save the new user to the database
}

// Service to find a user based on the query and exclude the password field
export const findAdmin = async (query: FilterQuery< IAdmin>) : Promise<any> => {
    const admin = await Admin.findOne(query).select('-password').exec();

    if(admin)
        return admin; // Return the found user if exists

    return null; // Return null if no user is found
};

export const isSuperAdmin = async (req : AuthenticatedRequest, res : Response) => {
    const isSuperAdmin = await findAdmin({ _id: req.user_id, role: 'Super Admin'})

    if(!isSuperAdmin){
        res.status(403).json({ success: false, message: 'Access Denied: You are not a Super Admin' });
        return;
    }
}
