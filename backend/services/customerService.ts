import { FilterQuery } from "mongoose";
import Customer, { ICustomer } from "../models/Customer";

// Service to create a new user and save it to the database
export const createCustomer = async (userData : Partial<ICustomer>) : Promise<ICustomer> => {
    const newCustomer = new Customer(userData); // Create a new user instance
    return await newCustomer.save(); // Save the new user to the database
}

// Service to find a user based on the query and exclude the password field
export const findCustomer = async (query: FilterQuery<ICustomer>) : Promise<any> => {
    const user = await Customer.findOne(query).exec();
    if (user) {
        const { password, ...userWithoutPassword } = user.toObject(); // Remove the password field
        return userWithoutPassword; // Return the user object without the password
    }

    return null; // Return null if no user is found
};
