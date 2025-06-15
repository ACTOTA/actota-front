import actotaApi from '@/src/lib/apiClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {

		const requestData = await request.json();
		const { user_id, amount, customer_id, payment_method_id, description } = requestData;;
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

		const response = await actotaApi.post("/payment/payment-intent",
			{
				user_id,
				amount,
				customer_id,
				payment_method_id,
				description
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
