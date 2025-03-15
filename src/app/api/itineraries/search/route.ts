import actotaApi from '@/src/lib/apiClient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log('API route called: /api/itineraries/search');
    const searchParams = await request.json();
    console.log('Search params received:', searchParams);

    try {
      // Forward the search parameters to the backend API
      const response = await actotaApi.post('/api/itineraries', searchParams);
      const data = response.data;

      console.log('Backend API response:', data);

      return NextResponse.json({
        success: true,
        message: "Search results fetched successfully",
        data: data
      });
    } catch (apiError) {
      console.error('Backend API error:', apiError);

      // For now, return a mock success response for testing purposes
      return NextResponse.json({
        success: true,
        message: "Mock search results (backend API not available)",
        data: {
          results: []
        }
      });
    }
  } catch (error) {
    console.error('Search route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}
