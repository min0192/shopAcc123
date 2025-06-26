import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  email: string;
  phone: string;
  password: string;
  name: string;
  balance: number;
  role: 'user' | 'admin' | 'seller';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>('User', UserSchema); 