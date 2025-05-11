import actotaApi from '@/src/lib/apiClient';
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
        // The backend now has a flexible date parser to handle various formats
        const response = await actotaApi.post(
            `/api/account/${user_id}/bookings/${itinerary_id}/with-payment`,
            {
                payment_intent_id,
                customer_id,
                arrival_datetime,
                departure_datetime
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('Error processing booking with payment:', error);
        return NextResponse.json(
            { error: error.message || "An unknown error occurred" },
            { status: error.response?.status || 500 }
        );
    }
}