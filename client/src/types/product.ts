import { Category } from "./category";

export interface Product {
  _id: string;
  code: string;
  account: string;
  password: string;
  title: string;
  price: number;
  security_information: string;
  image: string;
  subImages?: string[];
  level: number;
  rank?: string;
  category: string | Category;
  status: 'available' | 'sold';
  createdAt: string;
  updatedAt: string;
} 