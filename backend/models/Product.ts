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
  lead_time: number;

  getCurrentStock(sku?: string): number;
  getSafetyStock(sku?: string): Promise<number>;
  getReorderLevel(sku?: string): Promise<{ reorderLevel: number; safetyStock: number }>;
  getStockStatus(sku?: string): Promise<{ 
    reorderLevel: number; 
    currentStock: number; 
    status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
    amount: number;
    optimalStockLevel: number;
  }>;
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
    lead_time: { type: Number, default: 3 },
  },
  { timestamps: true }
);

// Get current stock
ProductSchema.methods.getCurrentStock = function (sku?: string): number {
  if (this.product_type === 'Variable' && sku) {
    const variant = this.variants.find((v: Variant) => v.sku === sku);
    return variant?.stock ?? 0;
  }
  return this.stock ?? 0;
};

// Safety Stock formula: Safety Stock = Z * σdemand * √Lead Time
ProductSchema.methods.getSafetyStock = async function (sku?: string): Promise<number> {
  let dailySales;
  if (this.product_type === 'Variable' && sku) {
    dailySales = await getProductDailyDemand(this._id, sku);
  } else {
    dailySales = await getProductDailyDemand(this._id);
  }

  const salesArray = dailySales.map(d => d.totalQuantity);
  const mean = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;

  // sample variance (n - 1)
  const variance =
    salesArray.length > 1
      ? salesArray.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (salesArray.length - 1)
      : 0;

  const stdDev = Math.sqrt(variance);
  const Z = 1.65; // 95% service level
  const leadTime = this.lead_time;

  return Math.round(Z * stdDev * Math.sqrt(leadTime));
};

// Reorder Level = (Average Daily Demand * Lead Time) + Safety Stock
ProductSchema.methods.getReorderLevel = async function (sku?: string): Promise<number> {
  const safetyStock = await this.getSafetyStock(sku);

  let dailySales;
  if (this.product_type === 'Variable' && sku) {
    dailySales = await getProductDailyDemand(this._id, sku);
  } else {
    dailySales = await getProductDailyDemand(this._id);
  }

  let avgDailyDemand: number;
  
  const salesArray = dailySales.map(d => d.totalQuantity);
  avgDailyDemand = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;

  const leadTime = this.lead_time;
  
  return Math.round(avgDailyDemand * leadTime + safetyStock)
};

ProductSchema.methods.getStockStatus = async function (
  sku?: string
): Promise<{ 
  reorderLevel: number; 
  currentStock: number; 
  status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  amount: number;
  optimalStockLevel: number;
}> {
  let dailySales;
  if (this.product_type === 'Variable' && sku) {
    dailySales = await getProductDailyDemand(this._id, sku);
  } else {
    dailySales = await getProductDailyDemand(this._id);
  }
  const totalQuantity = dailySales.reduce((total, sales) => total + sales.totalQuantity, 0)

  if(totalQuantity < 5) return { status: 'Balanced', reorderLevel: 0, currentStock: 0, amount: 0, optimalStockLevel: 0 }

  const reorderLevel = await this.getReorderLevel(sku);
  const currentStock = this.getCurrentStock(sku);
  
  // Calculate optimal stock level (target stock after restocking)
  const optimalStockLevel = Math.round(reorderLevel * 1.2);

  let status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  let amount: number;

  if (currentStock === 0) {
    status = 'Out of Stock';
    amount = optimalStockLevel;

  } else if (currentStock <= reorderLevel) {
    status = 'Understock'; 
    amount = optimalStockLevel - currentStock; 

  } else if (currentStock > optimalStockLevel * 1.2) {
    status = 'Overstock';
    amount = currentStock - optimalStockLevel; 

  } else {
    status = 'Balanced';
    amount = 0;
  }

  return { reorderLevel, currentStock, status, amount, optimalStockLevel };
};


const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;