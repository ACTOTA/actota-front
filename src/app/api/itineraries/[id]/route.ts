import actotaApi from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log(id, "id in get itinerary by id route");

    // Make the request with additional headers
    const response = await actotaApi.get(`/api/itineraries/${id}`);

    // If we get here, we should have JSON data
    return NextResponse.json({
      success: true, 
      message: "itinerary by id fetched successfully",
      data: response.data
    });

  } catch (error: any) {
    console.error('Fetch error:', error.message);
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