import { serverApiClient } from '@/src/lib/serverApiClient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Extract pagination parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    const backendUrl = `/itineraries${queryString ? `?${queryString}` : ''}`;
    const response = await serverApiClient.get(backendUrl);

    const data = await response.json();

    return NextResponse.json({success: true, message: "Itineraries fetched successfully", data: data});
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}
