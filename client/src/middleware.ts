import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { userJwtPayload } from './types/userJwtPayload';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('infor')?.value;
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
  const path = request.nextUrl.pathname;

  let decoded: userJwtPayload | null = null;
  
  // Verify token if exists
  if (token && secretKey) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secretKey)
      );
      decoded = payload as userJwtPayload;
    } catch (error) {
      console.log('JWT Verify Error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('infor');
      return response;
    }
  }

  // Handle login page access
  if (path === '/login') {
    if (decoded) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (path.startsWith('/admin')) {
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle seller routes
  if (path.startsWith('/seller')) {
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (decoded.role !== 'seller' && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
// Handle /nap-tien route
if (path.startsWith('/nap-tien')) {
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
  // For all other routes, allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/seller',
    '/seller/:path*',
    '/login',
    '/api/products/:path*',
    '/api/orders/:path*',
    '/api/users/:path*',
    '/nap-tien',
    '/nap-tien/:path*',
  ]
};