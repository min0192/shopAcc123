import mongoose, { Document, Schema } from 'mongoose';
import { Product } from './ProductModel';
import { User } from './UserModel';

export interface Order extends Document {
  user: User['_id'];
  orderItems: {
    account: Product['_id'];
    price: number;
  }[];
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Order>('Order', OrderSchema); 