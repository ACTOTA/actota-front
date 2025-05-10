import actotaApi from '@/src/lib/apiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {

		const requestData = await request.json();
		const { user_id, payment_intent_id, booking_id } = requestData;;

		if (!payment_intent_id || !user_id) {
			return NextResponse.json(
				{ error: "Payment Intent ID and User ID are required" },
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

		// Verify booking_id is provided if needed
		const response = await actotaApi.post("/api/payment/capture-payment",
			{
				user_id,
				payment_intent_id,
				booking_id, // Pass booking_id to backend
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return NextResponse.json(response.data);

	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
