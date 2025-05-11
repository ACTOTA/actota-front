import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the request body which should contain the customer_id to update
    const body = await request.json();
    const { customerId } = body;

    // Validate required field
    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
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

    // First, get the current session data
    let sessionResponse;
    try {
      sessionResponse = await actotaApi.get(
        "/api/auth/session",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
    } catch (error) {
      console.error('Failed to get session data:', error);
      return NextResponse.json(
        { error: "Failed to retrieve session data" },
        { status: 500 }
      );
    }

    if (!sessionResponse.data || !sessionResponse.data.user_id) {
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    // Get user ID from the session
    const userId = sessionResponse.data.user_id;

    // Now update the user in the database with the customer_id
    try {
      // Call the backend to update the user with the customer_id
      // This endpoint would need to be created on the backend if it doesn't exist
      await actotaApi.post(
        `/api/account/${userId}/update-customer-id`,
        { customer_id: customerId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      // Update the session data with the customer_id
      // By updating this session data, any subsequent requests 
      // will include the customer_id
      sessionResponse.data.customer_id = customerId;

      // Return success with updated session data
      return NextResponse.json({
        success: true,
        message: "Session updated with customer ID",
        user: sessionResponse.data
      });
    } catch (error) {
      console.error('Error updating customer ID:', error);
      return NextResponse.json(
        { error: "Failed to update customer ID" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in update-session route:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while updating the session"
      },
      { status: 500 }
    );
  }
}