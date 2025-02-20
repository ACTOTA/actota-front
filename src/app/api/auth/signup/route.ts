import { NextResponse } from 'next/server';
import { getSession } from '@/src/lib/session';
import actotaApi from '@/src/lib/apiClient';
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { firstName: string; lastName: string; email: string; password: string };
    console.log("signup route triggered",payload);
    const response = await actotaApi.post(
      "/api/auth/signup",
      { first_name: payload.firstName, last_name: payload.lastName, email: payload.email, password: payload.password },
    );
    console.log(response.data, 'response from signup route');

    return NextResponse.json(
      { success: true, message: 'Signup successful', data: response.data },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 