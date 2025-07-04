import { serverApiClient } from '@/src/lib/serverApiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const { 
            user_id, 
            itinerary_id,
            payment_intent_id,
            customer_id,
            arrival_datetime,
            departure_datetime
        } = requestData;

        // Basic validation
        if (!user_id || !itinerary_id || !payment_intent_id || !customer_id || !arrival_datetime || !departure_datetime) {
            return NextResponse.json(
                { error: "Missing required fields for booking with payment" },
                { status: 400 }
            );
        }

        // Get the auth token
        const token = cookies().get('auth_token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Call our backend API to create booking and capture payment in one operation
        // Only send the BookingInput payload that the backend expects
        const bookingPayload = {
            arrival_datetime,
            departure_datetime,
            customer_id,
            transaction_id: payment_intent_id,
        };

        console.log('Sending booking payload to backend:', JSON.stringify(bookingPayload, null, 2));

        const response = await serverApiClient.post(
            `/account/${user_id}/bookings/itinerary/${itinerary_id}`,
            bookingPayload,
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
                { error: data.error || 'Failed to create booking with payment' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error processing booking with payment:', error);
        return NextResponse.json(
            { error: error.message || "An unknown error occurred" },
            { status: error.response?.status || 500 }
        );
    }
}
