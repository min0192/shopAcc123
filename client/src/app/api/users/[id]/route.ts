import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Configure axios defaults
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context?.params?.id;
  if (!id) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const token = request.cookies.get('infor')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
    return NextResponse.json(
      { error: axiosError.response?.data?.message || 'Failed to fetch user' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context?.params?.id;
  if (!id) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const data = await request.json();
    const token = request.cookies.get('infor')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Log the request data for debugging
    console.log('Updating user with data:', {
      id,
      data,
      token: 'present'
    });
    
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      }
    );

    // Ensure response data is valid JSON
    if (response.status >= 400) {
      const errorMessage = typeof response.data === 'object' && response.data !== null
        ? (response.data as { message?: string }).message
        : 'Failed to update user';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating user:', error);
    const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
    
    // Log detailed error information
    console.error('Error details:', {
      status: axiosError.response?.status,
      message: axiosError.response?.data?.message,
      data: axiosError.response?.data
    });

    return NextResponse.json(
      { 
        error: axiosError.response?.data?.message || 'Failed to update user',
        details: axiosError.response?.data
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context?.params?.id;
  if (!id) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const token = request.cookies.get('infor')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error deleting user:', error);
    const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
    return NextResponse.json(
      { error: axiosError.response?.data?.message || 'Failed to delete user' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
