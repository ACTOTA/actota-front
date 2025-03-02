import { NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { getAuthCookie } from '@/src/helpers/auth';

export async function POST(request: Request) {
  try {
    const authToken = await getAuthCookie();
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { provider } = payload;

    if (!provider || !['google', 'facebook'].includes(provider)) {
      return NextResponse.json(
        { success: false, message: 'Invalid provider specified' },
        { status: 400 }
      );
    }

    // Generate the redirect URL for the OAuth flow
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/auth/link/callback`;
    
    // Call backend to get the OAuth URL
    const response = await actotaApi.post(
      "/api/auth/link",
      { provider, callbackUrl },
      { 
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error linking account:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}