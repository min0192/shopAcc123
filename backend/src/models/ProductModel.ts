import mongoose, { Document, Schema } from 'mongoose';

export interface Product extends Document {
  code: string;
  account: string;
  password: string;
  title: string;
  price: number;
  security_information: string;
  image: string;
  subImages?: string[];
  category: mongoose.Types.ObjectId;
  status: 'available' | 'sold';
}

const productSchema = new Schema<Product>(
  {
    code: { type: String, required: true },
    account: { type: String, required: true },
    password: { type: String, required: true },
    title: { type: String},
    price: { type: Number, required: true },
    security_information: { type: String, required: true },
    image: { type: String, required: true },
    subImages: { type: [String] },  
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { 
      type: String, 
      enum: ['available', 'sold'],
      default: 'available'
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Product>('Product', productSchema); 