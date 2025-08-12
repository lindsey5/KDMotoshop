import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/auth';
import { findAdmin } from '../services/adminService';
import Customer from '../models/Customer';

export const adminRequireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user_id = decoded.id;

    const user = await findAdmin({ _id: req.user_id });
    if (!user) {
      res.status(401).json({ success: false, message: 'User ID doesn\'t exist.' });
      return;
    }

    next(); 
  } catch (error : any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const customerRequireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user_id = decoded.id;

    const user = await Customer.findById(req.user_id);
    if (!user) {
      res.status(401).json({ success: false, message: 'Customer doesn\'t exist.' });
      return;
    }

    next(); 
  } catch (error : any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const tokenRequire = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user_id = decoded.id;

    next(); 
  } catch (error : any) {
    res.status(403).json({ success: false, message: error.message });
  }
};