import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import actotaApi from '@/src/lib/apiClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect('http://localhost:3000/auth/signin?error=missing_code');
    }

    // Exchange the code for user info via your backend
    const response = await actotaApi.post('/auth/google/callback', {
      code,
      state,
      redirect_uri: 'http://localhost:3000/api/auth/callback/google'
    });

    if (response.data.success) {
      // Set the auth token as a cookie
      const { token, user } = response.data;
      
      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      // Redirect to the home page or where the user was trying to go
      const redirectTo = state ? decodeURIComponent(state) : '/';
      return NextResponse.redirect(`http://localhost:3000${redirectTo}`);
    } else {
      return NextResponse.redirect('http://localhost:3000/auth/signin?error=auth_failed');
    }
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect('http://localhost:3000/auth/signin?error=callback_error');
  }
}