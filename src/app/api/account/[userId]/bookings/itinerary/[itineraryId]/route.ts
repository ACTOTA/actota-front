import { serverApiClient } from '@/src/lib/serverApiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { userId: string; itineraryId: string } }
) {
    try {
        const { userId, itineraryId } = params;
        const requestData = await request.json();
        
        console.log('Creating booking for user:', userId, 'itinerary:', itineraryId);
        console.log('Booking data:', JSON.stringify(requestData, null, 2));
        
        // Get the auth token
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Call the backend API to create the booking
        const response = await serverApiClient.post(
            `/account/${userId}/bookings/itinerary/${itineraryId}`,
            requestData,
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
                { error: data.error || 'Failed to create booking' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string; itineraryId: string } }
) {
    // Return 404 for GET requests as this endpoint is only for creating bookings
    return NextResponse.json(
        { error: "Method not allowed. Use POST to create a booking." },
        { status: 405 }
    );
}