import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.PAYOS_CLIENT_ID!;
const apiKey = process.env.PAYOS_API_KEY!;
const webhookUrl = process.env.PAYOS_WEBHOOK_URL!;

const payosClient = axios.create({
  baseURL: 'https://api.payos.vn/v1',
  headers: {
    'x-client-id': clientId,
    'x-api-key': apiKey,
  },
});

export const createPayOSOrder = async ({ amount, description }: { amount: number; description: string }) => {
  const order = {
    amount,
    description,
    orderCode: Math.floor(Math.random() * 1000000000),
    returnUrl: 'https://localhost:3000',
    cancelUrl: 'https://localhost:3000',
    webhookUrl,
  };
  console.log("Sending order to PayOS:", order); // 👈 THÊM DÒNG NÀY
  const response = await payosClient.post('/orders', order);
  return response.data;
};