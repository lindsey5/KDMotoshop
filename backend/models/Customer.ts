import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICustomer extends Document {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    image: UploadedImage;
}

// Define the schema
const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },

  },
  { timestamps: true }
);

// Create the model
const Category = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Category;
