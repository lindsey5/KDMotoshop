import { FilterQuery } from "mongoose";
import User, { IUser } from "../models/User"

// Service to create a new user and save it to the database
export const createUser = async (userData : Partial<IUser>) : Promise<IUser> => {
    const newUser = new User(userData); // Create a new user instance
    return await newUser.save(); // Save the new user to the database
}

// Service to find a user based on the query and exclude the password field
export const findUser = async (query: FilterQuery<IUser>) : Promise<any> => {
    const user = await User.findOne(query).exec();
    if (user) {
        const { password, ...userWithoutPassword } = user.toObject(); // Remove the password field
        return userWithoutPassword; // Return the user object without the password
    }

    return null; // Return null if no user is found
};
