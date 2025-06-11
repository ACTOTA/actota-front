import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simple check for auth cookie existence - we'll handle full validation in the routes
  const authToken = request.cookies.get('auth_token');
  const isLoggedIn = !!authToken;

  // Check if user is authenticated
  if (!isLoggedIn) {
    // Redirect to login if accessing protected routes
    if (request.nextUrl.pathname.startsWith('/profile')) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only match the profile routes - do not process API routes in middleware
  matcher: '/profile/:path*',
};
