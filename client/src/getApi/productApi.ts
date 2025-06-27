import axios from 'axios';
import { Product } from '@/types/product';
import { getCookie } from "cookies-next/client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const token = getCookie("infor");
    const res = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (id: string) => {
  try {
    const token = getCookie("infor");
    const res = await axios.get(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm mới
export const createProduct = async (data: Product) => {
  try {
    const token = getCookie("infor");
    const res = await axios.post(`${API_URL}/products`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (product: Product) => {
  const token = getCookie("infor");
  const res = await fetch(`${API_URL}/products/${product._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({...product, id: product._id} ),
  });

  let data = null;
  try {
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      data = await res.json();
    }
  } catch (err) {
    console.warn('Không thể parse JSON từ response:', err);
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to update product');
  }

  return data?.data || data; // đảm bảo hàm vẫn trả dữ liệu nếu có
};


// Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  try {
    const token = getCookie("infor");
    const res = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    const res = await axios.get(`${API_URL}/products?category=${categoryId}`);
    return res.data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return [];
    }
    return [];
  }
}