import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';

export const getBearerToken = (req: AuthenticatedRequest): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

// Create JWT token for a given user ID
export const createAccessToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30m"
  });
};

export const createRefreshToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const setTokenCookie = (
  res: Response,
  name: string,
  token: string,
  maxAgeMs: number
) => {
  res.cookie(name, token, {
    httpOnly: true,
    maxAge: maxAgeMs,
    sameSite: "none",
    secure: true
  });
};

// Verify password matches hashed password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Hash a plain password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
