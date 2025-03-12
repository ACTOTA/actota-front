import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';

export async function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Determine if we need to validate the token (only for protected routes)
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile');
  
  // If accessing a protected route, validate the token
  if (isProtectedRoute) {
    // If no token exists, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify that the token is valid and not expired
      const key = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_jwt_secret'
      );
      
      const { payload } = await jwtVerify(authToken, key);
      
      // Check if token is expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTimestamp) {
        // Token expired, redirect to login
        const loginUrl = new URL('/auth/signin', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        loginUrl.searchParams.set('expired', 'true'); // Flag for showing expired message
        
        // Clear the invalid cookie in the response
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth_token');
        
        return response;
      }
      
      // Valid token, proceed
      return NextResponse.next();
      
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      
      // Clear the invalid cookie in the response
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      
      return response;
    }
  }
  
  // For non-protected routes, no validation needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',  // Protected routes that require authentication
  ],
};
