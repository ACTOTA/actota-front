import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient } from '@/src/lib/serverApiClient';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const authToken = getAuthCookie();
    
    console.log(`API Route: Fetching itinerary ${id}, authenticated: ${!!authToken}`);
    
    // Fetch from backend using serverApiClient
    const response = await serverApiClient.get(`/itineraries/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}