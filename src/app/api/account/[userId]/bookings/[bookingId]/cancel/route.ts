import { NextRequest, NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; bookingId: string } }
) {
  try {
    const { userId, bookingId } = params;

    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call the backend cancellation endpoint
    const response = await actotaApi.post(
      `/api/account/${userId}/bookings/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the response from the backend
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Booking cancellation error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    if (error.response?.status === 400) {
      return NextResponse.json(
        { success: false, error: error.response.data.error || 'Invalid request' },
        { status: 400 }
      );
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Return the error response from backend if available
    if (error.response?.data) {
      return NextResponse.json(
        error.response.data,
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}