import { serverApiClient } from '@/src/lib/serverApiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {

		const requestData = await request.json();
		const { user_id, amount, customer_id, payment_method_id, description } = requestData;;
		console.log("Payment Intent Request Data:", JSON.stringify(requestData, null, 2));

		// Detailed validation with specific error messages
		if (!user_id) {
			console.error("Missing user_id");
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}
		if (!amount) {
			console.error("Missing amount");
			return NextResponse.json(
				{ error: "Amount is required" },
				{ status: 400 }
			);
		}
		if (!customer_id) {
			console.error("Missing customer_id");
			return NextResponse.json(
				{ error: "Customer ID is required" },
				{ status: 400 }
			);
		}
		if (!payment_method_id) {
			console.error("Missing payment_method_id");
			return NextResponse.json(
				{ error: "Payment Method ID is required" },
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

		const paymentPayload = {
			user_id,
			amount,
			customer_id,
			payment_method_id,
			description
		};
		
		console.log('Sending payment intent payload to backend:', JSON.stringify(paymentPayload, null, 2));
		console.log('Backend API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app');

		const response = await serverApiClient.post("/payment/payment-intent",
			paymentPayload,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log('Backend response status:', response.status);
		const data = await response.json();
		console.log('Backend response data:', JSON.stringify(data, null, 2));
		
		if (!response.ok) {
			console.error('Backend API error response:', {
				status: response.status,
				data: data
			});
			return NextResponse.json(
				{ error: data.error || `Backend returned ${response.status}: ${JSON.stringify(data)}` },
				{ status: response.status }
			);
		}

		return NextResponse.json(data);

	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
