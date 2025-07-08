import mongoose, { Document, Schema,  } from 'mongoose';
import { UploadedImage } from '../types/types';
import { hashPassword } from '../utils/authUtils';

export interface ICustomer extends Document {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    image: UploadedImage;
    addresses: {
      street: string;
      barangay: string;
      city: string;
      region: string;
      firstname: string;
      lastname: string;
      phone: string;
    }[]
}

// Define the schema
const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: false },
    image: {
      imageUrl: { type: String, required: false },
      imagePublicId: { type: String, required: false },
    },
    addresses: {
        type: [{
            street: { type: String, required: true },
            barangay: { type: String, required: true },
            city: { type: String, required: true },
            region: { type: String, required: true },
            firstname: { type: String, required: true },
            lastname: { type: String, required: true },
            phone: { type: String, required: false }
        }],
        required: false
    }
  },
  { timestamps: true }
);

// Hash password before saving if modified or new
CustomerSchema.pre<ICustomer>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Create the model
const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
