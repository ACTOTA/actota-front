import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your-very-strong-secret-key';

function extractToken(request: NextRequest, isBackendRoute: boolean) {
  if (isBackendRoute) {
    const authorization =
      request.headers.get('authorization') ||
      request.headers.get('Authorization');
    return authorization?.split(' ')[1] ?? null;
  } else {
    return request.cookies.get('auditToken')?.value ?? null;
  }
}

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return { payload, error: null };
  } catch (error) {
    return {
      payload: null,
      error:
        error instanceof Error ? error.message : 'Invalid or Expired token',
    };
  }
}

function handleFrontendRedirection(
  pathname: string,
  request: NextRequest,
  isAuthenticated: boolean
) {
  const publicRoutes = ['/', '/auth/reset', '/auth/signup'];
  const privateRoute = pathname.startsWith('/dashboard');

  // console.log(isAuthenticated+'--isAuthenticated', privateRoute+"--private", publicRoutes.includes(pathname)+"--public", pathname+"--pathname");
  if (isAuthenticated) {
    // If authenticated and trying to access a public route, redirect to dashboard
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If not authenticated and trying to access a private route, redirect to login
    if (privateRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBackendRoute = pathname.startsWith('/api');

  const token = extractToken(request, isBackendRoute);
  let isAuthenticated = false;

  // If there's a token, verify it
  if (token) {
    const { payload, error } = await verifyToken(token);
    // console.info('Payload:', payload, 'Error:', error);
    isAuthenticated = !!payload; // Set to true if payload exists
    if (error) {
      console.warn('Token error:', error);
    }
  }

  // Handle frontend redirection based on authentication status
  return handleFrontendRedirection(pathname, request, isAuthenticated);
}

export const config = {
  matcher: [
    '/',
   
  ],
};
