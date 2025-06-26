import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// POST /api/users/register
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

// GET /api/users/profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 