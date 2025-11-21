import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

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
    sameSite: "strict",
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

export function isStrongPassword(password : string) : boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
};