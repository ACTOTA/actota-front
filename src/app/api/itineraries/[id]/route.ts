import { NextRequest, NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
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
    
    // Try to fetch from backend without auth first (assuming it's a public endpoint)
    try {
      const response = await actotaApi.get(`/itineraries/${id}`);
      
      if (response.status === 200) {
        return NextResponse.json(response.data);
      }
    } catch (publicError: any) {
      console.log('Public fetch failed:', publicError.response?.status);
      
      // If public fetch fails and we have auth token, try with auth
      if (authToken) {
        try {
          const authResponse = await actotaApi.get(`/itineraries/${id}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (authResponse.status === 200) {
            return NextResponse.json(authResponse.data);
          }
        } catch (authError: any) {
          console.error('Authenticated fetch also failed:', authError.response?.status);
        }
      }
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