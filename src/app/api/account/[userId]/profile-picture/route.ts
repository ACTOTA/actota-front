import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import actotaApi from "@/src/lib/apiClient";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the backend API
    const apiUrl = `/account/${userId}/profile-picture`;
    
    // Create a new FormData instance to send to the backend
    const backendFormData = new FormData();
    
    // Get the file from the request
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded or invalid file" },
        { status: 400 }
      );
    }
    
    // Add the file to the backend form data
    backendFormData.append('file', file);
    
    // Make the request to the backend using fetch directly to properly handle multipart form data
    // Using axios with multipart form data can sometimes be problematic
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const fullUrl = `${apiBaseUrl}${apiUrl}`;

    console.log("Sending profile picture to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - the browser will set it with the correct boundary
      },
      body: backendFormData,
    });

    // Check if the response is ok
    if (!response.ok) {
      console.error("Upload failed with status:", response.status);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    // Parse the JSON response
    const responseData = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(responseData);
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