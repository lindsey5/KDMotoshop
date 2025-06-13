import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Create JWT token for a given user ID
export const createToken = (id: any): any => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 24 * 60 * 60 // 1 day in seconds
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
