import { serverApiClient } from '@/src/lib/serverApiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string; bookingId: string } }
) {
    try {
        const { userId, bookingId } = params;
        
        // Get the auth token
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Call the backend API to get the booking
        const response = await serverApiClient.get(
            `/account/${userId}/bookings/${bookingId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json(
                { error: data.error || 'Failed to fetch booking' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}