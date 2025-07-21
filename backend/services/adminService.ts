import { FilterQuery } from "mongoose";
import Admin, { IAdmin } from "../models/Admin"

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
