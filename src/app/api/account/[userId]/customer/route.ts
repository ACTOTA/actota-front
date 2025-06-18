import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    console.log('User: ', userId);
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Make a request to the backend to get or create a customer ID
    console.log(`Fetching/creating Stripe customer for user ${userId}`);
    const response = await actotaApi.post(
      `/account/${userId}/customer`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Log the response
    console.log('Customer API response:', response.data);

    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error getting/creating customer:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        error: error.response?.data?.message || error.message || "An error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}
