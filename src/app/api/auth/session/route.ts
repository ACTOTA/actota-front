import { NextRequest, NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { getAuthCookie } from '@/src/helpers/auth';

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
    const response = await actotaApi.get(
      "/api/auth/session",
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    // The session response should include the role from the backend
    console.log('Session response from backend:', JSON.stringify(response.data, null, 2));

    return NextResponse.json(
      { success: true, data: response.data },
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