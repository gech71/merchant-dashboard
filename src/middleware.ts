
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the request is for the login page, let it through.
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, secret);
    // Token is valid, proceed to the requested page.
    return NextResponse.next();
  } catch (err) {
    // Token is invalid, redirect to the login page.
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
