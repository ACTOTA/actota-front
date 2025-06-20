import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.searchParams.get('origin');
    const destination = request.nextUrl.searchParams.get('destination');
    const waypoints = request.nextUrl.searchParams.get('waypoints');
    const mode = request.nextUrl.searchParams.get('mode') || 'driving';
    
    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination parameters are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${apiKey}`;
    
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Directions API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Directions API error:', data);
      return NextResponse.json(
        { error: `Google Directions API error: ${data.status}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Directions API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}