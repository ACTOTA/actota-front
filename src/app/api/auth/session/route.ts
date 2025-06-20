import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient } from '@/src/lib/serverApiClient';
import { getAuthCookie, signOut } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authToken = await getAuthCookie();
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Get user session from backend
    const response = await serverApiClient.get(
      "/auth/session",
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    // Parse the response JSON
    const sessionData = await response.json();

    // Check if response has data
    if (!sessionData) {
      return NextResponse.json(
        { success: false, message: 'No session data returned from backend' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: sessionData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear the auth cookie
    await signOut();
    
    return NextResponse.json(
      { success: true, message: 'Successfully logged out' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during logout' },
      { status: error.response?.status || 500 }
    );
  }
}