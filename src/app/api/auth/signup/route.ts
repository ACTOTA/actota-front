import { NextResponse } from 'next/server';
import { serverApiClient } from '@/src/lib/serverApiClient';
import { setAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { firstName: string; lastName: string; email: string; password: string };
    const response = await serverApiClient.post(
      "/auth/signup",
      { first_name: payload.firstName, last_name: payload.lastName, email: payload.email, password: payload.password },
    );
    const responseData = await response.json();
    if (responseData.auth_token) {
      setAuthCookie(responseData.auth_token);
      
      // Get the session data
      const sessionResponse = await serverApiClient.get(
        "/auth/session",
        {
          headers: {
            'Authorization': `Bearer ${responseData.auth_token}`,
          }
        },
      );
      const sessionData = await sessionResponse.json();
      
      // Get or create a Stripe customer ID for this user
      let userData = sessionData;
      
      if (!userData.customer_id && userData.user_id) {
        try {
          const customerResponse = await serverApiClient.post(
            `/account/${userData.user_id}/customer`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${responseData.auth_token}`,
              }
            }
          );
          const customerData = await customerResponse.json();
          
          if (customerData && customerData.customer_id) {
            userData.customer_id = customerData.customer_id;
          }
        } catch (customerError) {
          console.error('Failed to get/create customer ID:', customerError);
          // Continue without customer_id - we'll try again later
        }
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Signup successful', 
          data: userData,
          auth_token: responseData.auth_token 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: responseData.message || 'Signup failed' },
        { status: response.status || 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 
