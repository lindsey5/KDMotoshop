import { Request, Response } from "express";
import { verifyPassword, createToken } from "../utils/authUtils";
import { createCustomer, findCustomer } from "../services/customerService";
import Admin from "../models/Admin";

const maxAge = 1 * 24 * 60 * 60; 

export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await Admin.findOne({ email });
    
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
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: 'none',      // important for cross-site cookies
        secure: true           // only send cookie over HTTPS
      });

      res.status(201).json({ success: true })
    } catch (err : any) {
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const signupCustomer = async (req : Request, res: Response) => {
  try{
    const isExist = await findCustomer({ email: req.body.email });

    if(isExist){
      res.status(409).json({ success: false, message: 'Email already used' });
      return;
    }

    const newCustomer = await createCustomer(req.body);
    const token = createToken(newCustomer._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: 'none',      // important for cross-site cookies
      secure: true           // only send cookie over HTTPS
    });
    res.status(201).json({ success: true });

  }catch(err : any){
    res.status(500).json({ success: false, message: err.message || 'Server error'})
  }
}

export const signinWithGoogle = async (req: Request, res: Response) => {
  try{
    const customer = await findCustomer({ email: req.body.email });
    
    if(customer){
      const token = createToken(customer._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: 'none',    
        secure: true           
      });
      res.status(201).json({ success: true, customer, token });
      return
    }

    const newCustomer = await createCustomer(req.body);
    const token = createToken(newCustomer._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: 'none',    
      secure: true           
    });
    res.status(201).json({ success: true, customer: newCustomer, token });

  }catch(err : any){
    console.log(err.message)
    res.status(500).json({ success: false, message: err.message || 'Server error'})
  }
}