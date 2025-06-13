import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User'; 
import { AuthenticatedRequest } from '../types/auth';
import { findUser } from '../services/userService';

export const userRequireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]?.replace(/"/g, '');

  if (!token) {
    res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user_id = decoded.id;

    const user = await User.findById(req.user_id);
    if (!user) {
      res.status(401).json({ success: false, message: 'User ID doesn\'t exist.' });
      return;
    }

    next(); 
  } catch (error : any) {
    res.status(403).json({ success: false, message: error.message });
  }
};


export const adminRequireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]?.replace(/"/g, '');

  if (!token) {
    res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user_id = decoded.id;

    const user = await findUser({ _id: req.user_id, role: 'Admin' });
    if (!user) {
      res.status(401).json({ success: false, message: 'User ID doesn\'t exist.' });
      return;
    }

    next(); 
  } catch (error : any) {
    res.status(403).json({ success: false, message: error.message });
  }
};
