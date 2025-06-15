import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const formData = await request.formData();
    
    // Check if there's a file
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    
    if (!file || !userId) {
      return NextResponse.json(
        { error: "File and userId are required" },
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

    // Create a new FormData for the backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    
    // Get API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const fullUrl = `${apiUrl}/account/${userId}/profile-picture`;
    
    // Make the request to the backend using axios
    console.log(`Sending request to: ${fullUrl}`);
    
    // Using axios directly with server-side request
    const response = await axios.post(
      fullUrl,
      backendFormData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Return the response from the backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error uploading profile picture:", error);
    
    return NextResponse.json(
      {
        error: error.response?.data?.message || error.message || "An error occurred while uploading profile picture"
      },
      { status: error.response?.status || 500 }
    );
  }
}