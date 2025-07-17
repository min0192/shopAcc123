export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  role: 'user' | 'admin' | 'seller';
  createdAt: string;
  updatedAt: string;
} 