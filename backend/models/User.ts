import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword } from '../utils/authUtils';
import { UploadedImage } from '../types/types';

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage;
  role: string
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: false },
    image: {
      public_id: { type: String, required: false },
      url: { type: String, required: false },
    },
    role: { type: String, required: true, enum: ['Admin', 'Staff'], default: 'Staff'}
  },
  { timestamps: true }
);

// Hash password before saving if modified or new
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Create the model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
