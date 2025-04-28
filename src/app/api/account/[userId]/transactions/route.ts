import actotaApi from '@/src/lib/apiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  console.log("#### GET TRANSACTIONS ROUTE ACCESSED");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);
  console.log("Params:", params);
  
  try {
    const { userId } = params;
    
    console.log('User ID from params:', userId);
    
    // Return a simple response for testing
    return NextResponse.json({
      message: "GET route is working",
      userId: userId,
      timestamp: new Date().toISOString()
    });
    
    // Comment out the actual implementation temporarily for testing
    /*
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await actotaApi.get(`/api/account/${userId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
    */
  } catch (error: any) {
    console.error('Error in transactions GET route:', error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

// Keep the POST method if you need it
export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  console.log("#### POST TRANSACTIONS ROUTE");
  try {
    const { userId } = params;
    
    console.log('User: ', userId);
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    const response = await actotaApi.post(`/api/account/${userId}/transactions`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error processing transaction request:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

