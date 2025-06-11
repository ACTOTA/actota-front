import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    // Handle OAuth error
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/signin?error=oauth_failed', request.url));
    }
    
    // Ensure we have a token
    if (!token) {
      console.error('No token received from OAuth callback');
      return NextResponse.redirect(new URL('/auth/signin?error=no_token', request.url));
    }
    
    // Set the auth token as an HTTP-only cookie (secure)
    await setAuthCookie(token);
    
    // Get redirect destination from URL params or default to home
    const redirectTo = searchParams.get('redirectTo') || '/';
    
    // Redirect without the token in the URL for security
    return NextResponse.redirect(new URL(redirectTo, request.url));
    
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=callback_failed', request.url));
  }
}