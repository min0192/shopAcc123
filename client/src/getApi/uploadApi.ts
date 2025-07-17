import axios from 'axios';
import { getCookie } from "cookies-next/client";

interface UploadResponse {
  url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie("infor");
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post<UploadResponse>(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
