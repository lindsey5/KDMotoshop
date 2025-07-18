import { FilterQuery } from "mongoose";
import Admin, { IAdmin } from "../models/Admin"

// Service to create a new user and save it to the database
export const createAdmin = async (userData : Partial<IAdmin>) : Promise<IAdmin> => {
    const newUser = new Admin(userData); // Create a new user instance
    return await newUser.save(); // Save the new user to the database
}

// Service to find a user based on the query and exclude the password field
export const findAdmin = async (query: FilterQuery< IAdmin>) : Promise<any> => {
    const admin = await Admin.findOne(query).exec();
    if (admin) {
        const { password, ...userWithoutPassword } = admin.toObject(); // Remove the password field
        return userWithoutPassword; // Return the admin object without the password
    }

    return null; // Return null if no user is found
};
