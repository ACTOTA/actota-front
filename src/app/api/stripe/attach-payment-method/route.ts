"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { customerId, paymentMethodId, setAsDefault } = body;

    // Validate required fields
    if (!customerId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Customer ID and Payment Method ID are required" },
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

    // Make a request to your backend to handle the Stripe API call
    // This is important because Stripe operations should be performed
    // on the server side for security reasons
    const response = await actotaApi.post(
      `/account/${paymentMethodId}/attach-payment-method`,
      {
        customer_id: customerId,
        payment_id: paymentMethodId,
        default: setAsDefault || false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error attaching payment method:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        error: error.response?.data?.message || error.message || "An error occurred while attaching the payment method"
      },
      { status: error.response?.status || 500 }
    );
  }
}
