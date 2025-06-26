import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import { Category } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Thêm danh mục mới
export const createCategory = async (data: Category) => {
  try {
    const token = getCookie('info');
    const res = await axios.post(`${API_URL}/categories`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (id: string, data: Category) => {
  try {
    const token = getCookie('info');
    const res = await axios.put(`${API_URL}/categories/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Xóa danh mục
export const deleteCategory = async (id: string) => {
  try {
    const token = getCookie('info');
    const res = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};