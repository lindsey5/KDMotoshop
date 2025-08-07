import { Request, Response } from "express";
import { verifyPassword, createToken, createCookie } from "../utils/authUtils";
import { createCustomer, findCustomer } from "../services/customerService";
import Admin from "../models/Admin";
import Customer from "../models/Customer";
import { sendVerificationCode } from "../services/emailService";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

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
      const token = createToken(user._id as string);
      createCookie(res, token, 'jwt');

      res.status(200).json({ success: true })
    } catch (err : any) {
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const customerLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await Customer.findOne({ email });
    
      if (!user) {
         res.status(404).json({ success: false, message: 'Email not found'})
         return;
      }

      if(!user.password){
        res.status(400).json({ success: false, message: 'This account was registered using Google. Please sign in with Google.'});
        return;
      }

      const isMatch = await verifyPassword(password, user.password);
  
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Incorrect Password'})
        return;
      }
      const token = createToken(user._id as string);
      createCookie(res, token, 'jwt');

      res.status(200).json({ success: true })
    } catch (err : any) {
      console.log(err)
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

    const token = createToken(newCustomer._id as string);

    createCookie(res, token, 'jwt');

    res.status(201).json({ success: true });

  }catch(err : any){
    res.status(500).json({ success: false, message: err.message || 'Server error'})
  }
}

export const sendSignupEmailVerification = async (req : Request, res : Response) => {
  try{
    const { email } = req.body
    const customer = await Customer.findOne({ email });

    if (customer) {
      res.status(400).json({ success: false, message: 'This email is already registered. Please use a different one.' });
      return;
    }
    const code = await sendVerificationCode(email)

    res.status(200).json({ success: true, code })

  }catch(err : any){
    res.status(500).json({ success: false, message: err.message || 'Server error'})
  }
}

export const signinWithGoogle = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ success: false, message: 'No ID token provided' });
      return;
    }

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ success: false, message: 'Invalid Google token' });
      return;
    }

    const { email, given_name, family_name, picture } = payload;

    let customer = await findCustomer({ email });

    if (!customer) {
      customer = await createCustomer({
        email,
        firstname: given_name,
        lastname: family_name,
        image: {
            imagePublicId: '',
            imageUrl: picture as string
        }
      });
    }

    const token = createToken(customer._id);
    createCookie(res, token, 'jwt');

    res.status(200).json({ success: true, customer, token });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const logout = (req : Request, res : Response) =>{
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    res.redirect('/');
}