import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookieConfig } from './lib/config/cookies';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Check if user is authenticated
  if (false) {
    // if (!session.isLoggedIn) {
    // Redirect to login if accessing protected routes
    if (request.nextUrl.pathname.startsWith('/profile')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/profile/:path*',
};
