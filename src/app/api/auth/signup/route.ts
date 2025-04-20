import { NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { setAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { firstName: string; lastName: string; email: string; password: string };
    const response = await actotaApi.post(
      "/api/auth/signup",
      { first_name: payload.firstName, last_name: payload.lastName, email: payload.email, password: payload.password },
    );
    if (response.data.auth_token) {
      setAuthCookie(response.data.auth_token);
      
      // Get the session data
      const sessionResponse = await actotaApi.get(
        "/api/auth/session",
        {
          headers: {
            'Authorization': `Bearer ${response.data.auth_token}`,
          }
        },
      );
      
      // Get or create a Stripe customer ID for this user
      let userData = sessionResponse.data;
      
      if (!userData.customer_id && userData.user_id) {
        try {
          const customerResponse = await actotaApi.post(
            `/api/account/${userData.user_id}/customer`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${response.data.auth_token}`,
              }
            }
          );
          
          if (customerResponse.data && customerResponse.data.customer_id) {
            userData.customer_id = customerResponse.data.customer_id;
          }
        } catch (customerError) {
          console.error('Failed to get/create customer ID:', customerError);
          // Continue without customer_id - we'll try again later
        }
      }
      
      return NextResponse.json(
        { success: true, message: 'Signup successful', data: userData },
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
