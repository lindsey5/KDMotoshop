import mongoose, { Document, Schema,  } from 'mongoose';
import { UploadedImage } from '../types/types';
import { hashPassword } from '../utils/authUtils';
import Order from './Order';

export interface ICustomer extends Document {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    image: UploadedImage;
    addresses: {
      street: string;
      barangay: string;
      city: string;
      region: string;
      firstname: string;
      lastname: string;
      phone: string;
      isDefault: boolean;
    }[],
    getLastOrder() : Promise<Date | null>,
    getTotalOrders() : Promise<number>
}

// Define the schema
const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
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
            phone: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
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

CustomerSchema.methods.getLastOrder = async function () {
  const order = await Order.findOne({ 'customer.customer_id': this._id }).sort({ createdAt: -1})

  if(!order) return null

  return order?.createdAt;
}

CustomerSchema.methods.getTotalOrders = async function () {
  const totalOrders = await Order.countDocuments({ 'customer.customer_id': this._id })

  return totalOrders
}

// Create the model
const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
