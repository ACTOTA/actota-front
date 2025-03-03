"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { paymentMethodId } = body;

    // Validate required fields
    if (!paymentMethodId) {
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

    // Make a request to your backend to handle the Stripe API call
    const response = await actotaApi.post(
      `/stripe/delete-payment-method`,
      {
        paymentMethodId,
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
    console.error("Error deleting payment method:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        error: error.response?.data?.message || error.message || "An error occurred while deleting the payment method"
      },
      { status: error.response?.status || 500 }
    );
  }
}