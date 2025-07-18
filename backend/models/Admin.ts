import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword } from '../utils/authUtils';
import { UploadedImage } from '../types/types';

export interface IAdmin extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  image?: UploadedImage;
}

// Define the schema
const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: false },
    image: {
      type: {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true }
      },
      required: false
    },
  },
  { timestamps: true }
);

// Hash password before saving if modified or new
AdminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Create the model
const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
