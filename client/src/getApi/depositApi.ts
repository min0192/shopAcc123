import axios from 'axios';
import { getCookie } from 'cookies-next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPayOSDeposit = async (amount: number) => {
  const token = getCookie("infor");
  const res = await axios.post(
    `${API_URL}/deposit/pending`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
