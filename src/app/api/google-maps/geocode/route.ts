import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    const latlng = request.nextUrl.searchParams.get('latlng');
    
    if (!address && !latlng) {
      return NextResponse.json(
        { error: 'Either address or latlng parameter is required' },
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

    let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}`;
    
    if (address) {
      url += `&address=${encodeURIComponent(address)}`;
    } else if (latlng) {
      url += `&latlng=${encodeURIComponent(latlng)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Geocoding API error:', data);
      return NextResponse.json(
        { error: `Google Geocoding API error: ${data.status}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}