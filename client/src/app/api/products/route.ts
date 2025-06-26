import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products${category ? `?category=${category}` : ''}`
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const token = request.cookies.get('token')?.value;
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 