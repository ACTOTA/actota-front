import { NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import axios from 'axios';
import { setAuthCookie } from '@/src/helpers/auth';
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email: string; password: string };

    const response = await actotaApi.post(
      "/api/auth/signin",
      { email: payload.email, password: payload.password },
    );

    if (response.data.auth_token) {

      setAuthCookie(response.data.auth_token);
      const sessionResponse = await actotaApi.get(
        "/api/auth/session",
        {
          headers: {
            'Authorization': `Bearer ${response.data.auth_token}`,
          }
        },
      );
      return NextResponse.json(
        { success: true, message: 'Login successful', data: sessionResponse.data },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 
