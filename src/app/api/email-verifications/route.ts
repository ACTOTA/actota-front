import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Handle PUT requests for verification
export async function PUT(request: NextRequest) {
  console.log('=== PUT /api/email-verifications called ===');
  
  try {
    // Get verification ID from query parameter
    const searchParams = request.nextUrl.searchParams;
    const verificationId = searchParams.get('id');
    
    console.log('Verification ID from query:', verificationId);
    
    if (!verificationId) {
      return NextResponse.json(
        { success: false, message: 'Verification ID is required' },
        { status: 400 }
      );
    }
    
    const payload = await request.json();
    
    // Check for userId in query params (for email-change mode)
    const userId = searchParams.get('userId');
    
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    
    // Get the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    console.log('Verifying email with ID:', verificationId);
    console.log('User ID:', userId);
    console.log('Payload:', payload);
    console.log('Backend base URL:', backendUrl);
    
    // Determine the endpoint based on whether this is a user email change
    const fullUrl = userId 
      ? `${backendUrl}/api/account/${userId}/email-verifications/${verificationId}`
      : `${backendUrl}/api/email-verifications/${verificationId}`;
    console.log('Full backend URL:', fullUrl);
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth header if present (for email-change mode)
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Forward the request to the backend
    const response = await fetch(
      fullUrl, 
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to verify email');
    }

    const data = await response.json();
    console.log('Backend response:', data);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error: any) {
    console.error('Error verifying email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to verify email' 
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Check for userId in query params (for email-change mode)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    
    // Get the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Determine the endpoint based on whether this is a user email change
    const endpoint = userId 
      ? `${backendUrl}/api/account/${userId}/email-verifications`
      : `${backendUrl}/api/email-verifications`;

    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth header if present (for email-change mode)
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward the request to the backend
    const response = await fetch(
      endpoint, 
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create verification');
    }

    const data = await response.json();
    console.log('Backend email verification response:', data);

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error: any) {
    console.error('Error creating email verification:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create verification' 
      },
      { status: error.status || 500 }
    );
  }
}
