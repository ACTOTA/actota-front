import { NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Fetching itinerary with ID:', id);

    // Use direct localhost URL during development
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/api/itineraries/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Add credentials if needed
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Itinerary fetched successfully",
      data: data
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch itinerary',
        details: error.message
      },
      { status: 500 }
    );
  }
}