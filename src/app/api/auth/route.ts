import { NextResponse } from 'next/server';
import { getSession } from '@/src/lib/session';
import { actotaApi } from '@/src/lib/api';
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email: string; password: string };

    const session = await getSession();
    const { data } = await actotaApi.post(
      "api/auth/signin",
      { email: payload.email, password: payload.password },
    );

    // Here you would typically validate credentials against your database
    // This is just an example
    if (data) {
      session.user = {
        user_id: data?.user_id,
        email: data?.email,
        type: data?.type,
      };
      session.token = data?.token;
      session.isLoggedIn = true;

      await session.save();
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
} 