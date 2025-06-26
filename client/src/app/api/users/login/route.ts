import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Set token in cookie
    const token = response.data.token;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };
    
    return NextResponse.json(
      response.data,
      {
        headers: {
          'Set-Cookie': `token=${token}; Path=/; ${Object.entries(cookieOptions)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 