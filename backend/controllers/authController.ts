import { Request, Response } from "express";
import User from "../models/User";
import { verifyPassword, createToken } from "../utils/authUtils";

export const login = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
      const user = await User.findOne({ email, role });
    
      if (!user) {
         res.status(404).json({ success: false, message: 'Email not found'})
         return;
      }

      const isMatch = await verifyPassword(password, user.password);
  
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Incorrect Password'})
        return;
      }
      const token = createToken(user._id);

      res.status(201).json({ success: true, token, user })
    } catch (err : any) {
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

