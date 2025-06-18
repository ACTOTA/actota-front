import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; favoriteId: string } }
) {
  try {
    const { userId, favoriteId } = params;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log('Add favorite request - userId:', userId, 'favoriteId:', favoriteId, 'token exists:', !!token);

    // Forward the request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';
    const response = await fetch(`${API_BASE_URL}/account/${userId}/favorites/${favoriteId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('Add favorite error:', errorData, 'Status:', response.status);
      return NextResponse.json(
        { error: typeof errorData === 'string' ? errorData : errorData.error || errorData.message || "Failed to add favorite" },
        { status: response.status }
      );
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.error('Non-JSON response from backend:', textData);
      return NextResponse.json(
        { error: 'Backend returned non-JSON response', details: textData },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; favoriteId: string } }
) {
  try {
    const { userId, favoriteId } = params;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log('Remove favorite request - userId:', userId, 'favoriteId:', favoriteId, 'token exists:', !!token);

    // Forward the request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';
    const response = await fetch(`${API_BASE_URL}/account/${userId}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('Remove favorite error:', errorData, 'Status:', response.status);
      return NextResponse.json(
        { error: typeof errorData === 'string' ? errorData : errorData.error || errorData.message || "Failed to remove favorite" },
        { status: response.status }
      );
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.error('Non-JSON response from backend:', textData);
      return NextResponse.json(
        { error: 'Backend returned non-JSON response', details: textData },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}