import { Request, Response } from "express";
import { verifyPassword, createAccessToken, createRefreshToken, setTokenCookie, hashPassword, isStrongPassword } from "../utils/authUtils";
import { createCustomer, findCustomer } from "../services/customerService";
import Admin from "../models/Admin";
import Customer from "../models/Customer";
import { sendResetEmail, sendVerificationCode } from "../services/emailService";
import { OAuth2Client } from "google-auth-library";
import { AuthenticatedRequest } from "../types/auth";
import crypto from 'crypto';
import ResetToken from "../models/ResetToken";
import { io } from "../middlewares/socket";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email, status: 'Active' });

    if (!user) {
      res.status(404).json({ success: false, message: "Email not found" });
      return;
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Incorrect Password" });
      return;
    }

    // Tokens
    const accessToken = createAccessToken(user._id as string);
    const refreshToken = createRefreshToken(user._id as string);

    setTokenCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    setTokenCookie(res, "accessToken", accessToken, 30 * 60 * 1000); 

    res.status(200).json({ success: true, accessToken });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const customerLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await Customer.findOne({ email });
    
      if (!user) {
         res.status(404).json({ success: false, message: 'Email not found'})
         return;
      }

      if(user.status === 'Deactivated'){
        res.status(403).json({ success: false, message: 'Your account has been deactivated.'})
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

      const accessToken = createAccessToken(user._id.toString());
      const refreshToken = createRefreshToken(user._id.toString());

      setTokenCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
      setTokenCookie(res, "accessToken", accessToken, 30 * 60 * 1000); 

      res.status(200).json({ success: true, accessToken })
    } catch (err : any) {
      console.log(err)
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
}

export const signupCustomer = async (req : Request, res: Response) => {
  try{
    const { code, ...rest } = req.body;
    const verificationCode = req.cookies?.verificationCode;
    if(!verificationCode){
      res.status(401).json({ success: false, message: 'No verification code found.'})
      return;
    }

    const isExist = await findCustomer({ email: rest.email });

    if(isExist){
      res.status(409).json({ success: false, message: 'Email already used' });
      return;
    }
    const isMatch = await verifyPassword(code.toString(), verificationCode);
  
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect Verification Code'})
      return;
    }

    if(!isStrongPassword(rest.password)){
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.'})
      return;
    }

    const newCustomer = await createCustomer(rest);

    const accessToken = createAccessToken(newCustomer._id.toString());
    const refreshToken = createRefreshToken(newCustomer._id.toString());

    setTokenCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    setTokenCookie(res, "accessToken", accessToken, 30 * 60 * 1000); 
    res.clearCookie('verificationCode');

    res.status(201).json({ success: true });

  }catch(err : any){
    console.log(err)
    res.status(500).json({ success: false, message: err.message || 'Server error'})
  }
}

export const sendSignupEmailVerification = async (req : Request, res : Response) => {
  try{
    const { email, password } = req.body
    
    const customer = await Customer.findOne({ email });

    if (customer) {
      res.status(400).json({ success: false, message: 'This email is already registered. Please use a different one.' });
      return;
    }

    const isPasswordValid = isStrongPassword(password);

    if(!isPasswordValid){
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.'})
      return;
    }

    const code = await sendVerificationCode(email)

    if(!code){
      res.status(400).json({ success: false, message: 'Failed to send verification code please try again.'})
      return;
    }

    const hashedCode = await hashPassword(code.toString());

    setTokenCookie(res, "verificationCode", hashedCode, 5 * 60 * 1000); 

    res.status(200).json({ success: true  })

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

    if(customer?.status === 'Deactivated'){
      res.status(403).json({ success: false, message: 'Your account has been deactivated.'})
      return;
    }

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

    const accessToken = createAccessToken(customer._id as string);
    const refreshToken = createRefreshToken(customer._id as string);

    setTokenCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    setTokenCookie(res, "accessToken", accessToken, 30 * 60 * 1000); 

    res.status(200).json({ success: true, accessToken });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const logout = (req : Request, res : Response) =>{
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.redirect('/');
}

export const getUser = async (req : AuthenticatedRequest, res : Response) => {
  try{
    const id = req.user_id;

    const customer = await Customer.findOne({ _id: id, status: 'Active'});
    const admin = await Admin.findOne({ _id: id, status: 'Active'})
    
    if(!customer && !admin) {
       res.status(404).json({ success: false, message: 'User not found' });
       return;
    }
    
    if(customer){
      res.status(200).json({ success : true, user: { ...customer.toObject(), role: 'Customer'}})
    }else if(admin) {
      res.status(200).json({ success : true, user: admin})
    }

  }catch(err : any){
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

export const forgotPassword = async (req : Request, res : Response) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });

    if (!customer) {
      res.status(404).json({ error: 'No user with that email.' });
      return;
    }

    if(!customer.password){
      res.status(400).json({ success: false, message: 'Failed to reset password. This account was created using Google Sign-In.'});
      return;
    }

    if(customer.status === 'Deactivated'){
      res.status(403).json({ success: false, message: 'Your account has been deactivated.'})
      return;
    }

    await ResetToken.findOneAndDelete({ customer_id: customer._id });

    // Create reset token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    await ResetToken.create({ 
      customer_id: customer._id, 
      resetPasswordToken: hashedToken,
      resetPasswordExpire: Date.now() + 5 * 60 * 1000
    })

    await sendResetEmail(customer.email, token);

    res.status(200).json({ success: true, message: 'Reset email sent!' });
  } catch (err : any) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export const resetPassword = async (req : Request, res : Response) => {
  try{
    const { token } = req.params;
    const { newPassword } = req.body;

    const isStrong = isStrongPassword(newPassword);
    if(!isStrong){
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.' })
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await ResetToken.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!resetToken) {
      res.status(400).json({ message: 'Token is invalid or expired.' });
      return;
    }

    const customer = await Customer.findById(resetToken.customer_id);
    if(!customer){
      res.status(404).json({ success: false, message: 'User not found'});
      return;
    }

    if(!customer.password){
      res.status(400).json({ success: false, message: 'Failed to reset password. This account was created using Google Sign-In.'})
      return;
    }

    customer.password = newPassword;
    await customer.save();
    await resetToken.deleteOne();

    io?.to(customer._id.toString()).emit('logout', {});

    res.status(200).json({ success: true, message: 'Password has been reset successfully!' });
  }catch(err : any){
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};