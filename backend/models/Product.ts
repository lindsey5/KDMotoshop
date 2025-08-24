import mongoose, { Document, Schema, Types } from 'mongoose';
import { UploadedImage } from '../types/types';
import { getProductDailyDemand } from '../services/orderService';

interface Variant {
  _id: Types.ObjectId;
  sku: string;
  image?: UploadedImage;
  price: number;
  stock: number;
  attributes: { [key: string]: string };
}

export interface IProduct extends Document {
  product_name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  product_type: 'Single' | 'Variable';
  visibility: string;
  weight: number;
  added_by: Types.ObjectId;
  images: UploadedImage[];
  thumbnail: UploadedImage;
  variants: Variant[];
  attributes: string[];
  rating: number;

  getCurrentStock(sku?: string): number;
  getSafetyStock(sku?: string): Promise<number>;
  getReorderLevel(sku?: string): Promise<{ reorderLevel: number, safetyStock: number }>;
  getReorderQuantity(sku?: string): Promise<{ reorderQuantity: number, reorderLevel: number, currentStock: number, safetyStock: number}>;
  getStockStatus(sku?: string): Promise<string>;
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
          imagePublicId: { type: String, required: true },
        },
      ],
      required: true,
    },
    thumbnail: {
      type: {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true },
      },
      required: true,
    },
    variants: {
      type: [
        {
          sku: { type: String, required: true },
          price: { type: Number, required: true },
          stock: { type: Number, required: true },
          attributes: { type: Map, of: String, required: true },
        },
      ],
    },
    attributes: { type: [String] },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Get current stock
ProductSchema.methods.getCurrentStock = function (sku?: string): number {
  if (this.product_type === 'Variable' && sku) {
    const variant = this.variants.find((v : any) => v.sku === sku);
    return variant?.stock ?? 0;
  }
  return this.stock ?? 0;
};

// Safety Stock formula:
// Safety Stock = Z * σdemand * √Lead Time
// where:
// Z = service level factor (e.g., 1.65 for 95% service level)
// σdemand = standard deviation of daily demand
// Lead Time = time (in days) it takes to receive inventory after placing an order
ProductSchema.methods.getSafetyStock = async function (sku?: string): Promise<number> {
    let dailySales;
    if (this.product_type === 'Variable' && sku) {
      dailySales = await getProductDailyDemand(this._id, sku);
    } else {
      dailySales = await getProductDailyDemand(this._id);
    }

    if (!dailySales.length) return 0;
    const salesArray = dailySales.map(d => d.totalQuantity);
    const mean = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;
    const variance = salesArray.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / salesArray.length;
    const stdDev = Math.sqrt(variance);
    const Z = 1.65; // 95% service level
    const leadTime = 3;
    return Math.round(Z * stdDev * Math.sqrt(leadTime));
};

// Reorder Level calculation
// Reorder Level = (Average Daily Demand * Lead Time) + Safety Stock
ProductSchema.methods.getReorderLevel = async function (sku?: string): Promise<{ reorderLevel: number, safetyStock: number}> {
  const safetyStock = await this.getSafetyStock(sku);
  let dailySales;
  if (this.product_type === 'Variable' && sku) {
    dailySales = await getProductDailyDemand(this._id, sku);
  } else {
    dailySales = await getProductDailyDemand(this._id);
  }

  const salesArray = dailySales.length ? dailySales.map(d => d.totalQuantity) : [0];
  const avgDailyDemand = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;
  const leadTime = 3;

  return { reorderLevel: Math.round(avgDailyDemand * leadTime + safetyStock), safetyStock };
};

// reorderQuantity Restock
ProductSchema.methods.getReorderQuantity = async function (sku?: string) : Promise<{ reorderQuantity: number, reorderLevel: number, currentStock: number, safetyStock: number}>{
  const { reorderLevel, safetyStock } = await this.getReorderLevel(sku);
  const currentStock = this.getCurrentStock(sku);
  const reorderQuantity = reorderLevel + safetyStock - currentStock;
  return { reorderQuantity: reorderQuantity > 0 ? reorderQuantity : 0, reorderLevel,  currentStock, safetyStock };
};

// Stock Status
ProductSchema.methods.getStockStatus = async function (sku?: string): Promise<string> {
  const { reorderLevel } = await this.getReorderLevel(sku);
  const currentStock = this.getCurrentStock(sku);

  if (currentStock <= 0) return 'Out of Stock';
  if (currentStock <= reorderLevel) return 'Low Stock';
  return 'Healthy';
};

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
