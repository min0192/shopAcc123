import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface DashboardData {
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Array<{
    _id: string;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: string;
  }>;
  ordersByStatus: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
}

interface ApiErrorResponse {
  message?: string;
}

// GET /api/admin/dashboard
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user role from cookie
    const userRole = request.cookies.get('userRole')?.value;
    
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      return NextResponse.json(
        { error: 'API URL is not configured' },
        { status: 500 }
      );
    }

    // Fetch dashboard data from backend
    const response = await axios.get<DashboardData>(
      `${API_URL}/admin/dashboard`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    
    // Type guard for axios error
    const axiosError = error as { 
      response?: { 
        status?: number; 
        data?: ApiErrorResponse 
      } 
    };
    
    if (axiosError?.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    if (axiosError?.response?.status === 403) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    // Return the error message from the backend if available
    return NextResponse.json(
      { error: axiosError?.response?.data?.message || 'Failed to fetch dashboard data' },
      { status: axiosError?.response?.status || 500 }
    );
  }
} 