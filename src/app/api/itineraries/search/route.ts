import actotaApi from '@/src/lib/apiClient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log('API route called: /api/itineraries/search');
    const searchParams = await request.json();
    console.log('Search params received:', searchParams);

    // Validate and format the request body according to backend expectations
    const formattedParams = {
      locations: searchParams.locations || [],
      duration: searchParams.duration || [],
      guests: searchParams.guests || [],
      activities: searchParams.activities || [],
      adults: searchParams.adults || 1,
      children: searchParams.children || 0,
      infants: searchParams.infants || 0,
      lodging: searchParams.lodging || [],
      transportation: searchParams.transportation || ""
    };

    console.log('Formatted params for backend:', formattedParams);

    // Forward the search parameters to the backend API
    const response = await actotaApi.post('/itineraries/search', formattedParams);
    const data = response.data;

    console.log('Backend API response:', data);

    return NextResponse.json({
      success: true,
      message: "Search results fetched successfully",
      data: data
    });
  } catch (error: any) {
    console.error('Search route error:', error);
    console.error('Error response data:', error.response?.data);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data || error.message || 'Failed to process search request'
      },
      { status: 500 }
    );
  }
}
