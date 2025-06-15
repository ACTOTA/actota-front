import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get user ID from route params
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { customer_id } = body;

    // Validate required field
    if (!customer_id) {
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

    // Call the backend API to update the user's customer_id
    try {
      const response = await actotaApi.post(
        `/account/${userId}/update-customer-id`,
        { customer_id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: "Customer ID updated successfully",
        data: response.data
      });
    } catch (error: any) {
      console.error('Error updating customer ID:', error);
      
      return NextResponse.json(
        { 
          error: error.response?.data?.message || error.message || "Failed to update customer ID" 
        },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in update-customer-id route:", error);
    
    return NextResponse.json(
      {
        error: error.message || "An error occurred while updating the customer ID"
      },
      { status: 500 }
    );
  }
}