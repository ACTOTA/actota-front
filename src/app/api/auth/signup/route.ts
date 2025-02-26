import { NextResponse } from 'next/server';
import { getSession } from '@/src/lib/session';
import actotaApi from '@/src/lib/apiClient';
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { firstName: string; lastName: string; email: string; password: string };
    const response = await actotaApi.post(
      "/api/auth/signup",
      { first_name: payload.firstName, last_name: payload.lastName, email: payload.email, password: payload.password },
    );
    if(response.data.auth_token){
      const sessionResponse = await actotaApi.get(
        "/api/auth/session",
        { headers: {
          'Authorization': `Bearer ${response.data.auth_token}`,
        }},
      );
      return NextResponse.json(
        { success: true, message: 'Signup successful', data:{...sessionResponse.data, auth_token: response.data.auth_token} },
        { status: 200 }
      );
    }
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 