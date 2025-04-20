import actotaApi from '@/src/lib/apiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export async function POST(request: NextRequest) {
	try {

		const requestData = await request.json();
		const { user_id, amount, customer_id, payment_method_id } = requestData;;
		console.log("Request Data:", requestData);

		if (!user_id || !amount || !customer_id || !payment_method_id) {
			return NextResponse.json(
				{ error: "Amount, Customer ID and Payment Method ID are required" },
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

		const response = await actotaApi.post("/api/payment/payment-intent",
			{
				user_id,
				amount,
				customer_id,
				payment_method_id,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return NextResponse.json(response.data);

		// Return the client secret
		// return NextResponse.json({
		// 	// clientSecret: paymentIntent.client_secret
		// });
	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
