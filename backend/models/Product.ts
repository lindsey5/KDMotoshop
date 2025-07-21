import mongoose, { Document, Schema, Types } from 'mongoose';
import { UploadedImage } from '../types/types';

interface Variant {
  _id: Types.ObjectId;
  sku: string;
  image: UploadedImage;
  price: number | null;
  stock: number | null;
  attributes: {
    [key: string]: string;
  };
}

interface IProduct extends Document {
  product_name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  product_type: string;
  visibility: string;
  weight: number;
  added_by: Types.ObjectId;
  images: UploadedImage[];
  thumbnail: UploadedImage;
  variants: Variant[]; 
  attributes: string[];
  rating: Number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    product_name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    stock: { type: Number },
    product_type: { type: String, required: true },
    visibility: { type: String, required: true },
    weight: { type: Number, required: true },
    added_by: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    images: { 
        type: [
            {
                imageUrl: { type: String, required: true },
                imagePublicId: { type: String, required: true }
            }
        ], 
        required: true
    },
    thumbnail: { 
        type:  {
            imageUrl: { type: String, required: true },
            imagePublicId: { type: String, required: true }
        },
        required: true
    },
    variants: { 
        type: [
            {
                sku: { type: String, required: true },
                price: { type: Number, required: true, },
                stock: { type: Number, required: true, },
                attributes: { type: Map, of: String, required: true }
            }
        ],
    },
    attributes: { type: [String] },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);


const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
