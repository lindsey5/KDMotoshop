import mongoose, { Document, Schema } from 'mongoose';

interface Variant {
  sku: string;
  price: number | null;
  stock: number | null;
  added_by: string;
  attributes: {
    [key: string]: string;
  };
}

type UploadedImage = {
  imageUrl: string;
  imagePublicId: string;
};

interface IProduct extends Document {
  product_name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  product_type: string;
  visibility: string;
  added_by: string;
  images: UploadedImage[];
  thumbnail: UploadedImage;
  variants: Variant[];
  attributes: string[];
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    product_name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String, unique: true },
    price: { type: Number },
    stock: { type: Number },
    product_type: { type: String, required: true },
    visibility: { type: String, required: true },
    added_by: { type: String, required: true },
    images: [
      {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true }
      }
    ],
    thumbnail: {
      imageUrl: { type: String, required: true },
      imagePublicId: { type: String, required: true }
    },
    variants: [
      {
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true, },
        stock: { type: Number, required: true, },
        added_by: { type: String, required: true },
        attributes: { type: Map, of: String, required: true }
      }
    ],
    attributes: [String]
  },
  { timestamps: true }
);


const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
