import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';
    const response = await fetch(`${API_BASE_URL}/account/${userId}/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: errorData || "Failed to fetch favorites" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the request body as text first, then parse it
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    console.log('Add favorite request - userId:', userId, 'body:', body, 'token exists:', !!token);

    // Forward the request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';
    const response = await fetch(`${API_BASE_URL}/account/${userId}/favorites`, {
      method: 'POST',
      body: bodyText,
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

    const data = await response.json();
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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get the auth token
    const token = cookies().get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get favoriteId from query parameters
    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('favoriteId');

    if (!favoriteId) {
      return NextResponse.json(
        { error: "Favorite ID is required" },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';
    const response = await fetch(`${API_BASE_URL}/account/${userId}/favorites?favoriteId=${favoriteId}`, {
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}