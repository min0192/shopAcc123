import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import { Order } from '@/types/order';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo đơn hàng mới
export const createOrder = async (data: Order) => {
  try {
    const token = getCookie('info');
    const res = await axios.post(`${API_URL}/orders`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Lấy đơn hàng của user hiện tại
export const getMyOrders = async () => {
  try {
    const token = getCookie('info');
    const res = await axios.get(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (id: string) => {
  try {
    const token = getCookie('info');
    const res = await axios.get(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả đơn hàng (admin)
export const getAllOrders = async () => {
  try {
    const token = getCookie('info');
    const res = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const token = getCookie('info');
    const res = await axios.put(`${API_URL}/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};