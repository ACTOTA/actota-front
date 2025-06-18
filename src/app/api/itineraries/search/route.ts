import { serverApiClient } from '@/src/lib/serverApiClient';
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
      arrival_datetime: searchParams.arrival_datetime || null,
      departure_datetime: searchParams.departure_datetime || null,
      adults: searchParams.adults || (searchParams.guests && searchParams.guests.length > 0 ? searchParams.guests[0] : 2),
      children: searchParams.children || 0,
      infants: searchParams.infants || 0,
      activities: searchParams.activities || [],
      lodging: searchParams.lodging || [],
      transportation: searchParams.transportation || ""
    };

    console.log('Formatted params for backend:', formattedParams);

    // Forward the search parameters to the backend API
    const response = await serverApiClient.post('/itineraries/search', formattedParams);
    const data = await response.json();

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
