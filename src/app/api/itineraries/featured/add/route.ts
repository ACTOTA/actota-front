import { NextRequest, NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Try to get auth token from multiple sources
    // 1. First try from cookie (httpOnly)
    let authToken = await getAuthCookie();
    
    // 2. If not in cookie, try from header (passed from client localStorage)
    if (!authToken) {
      const headerToken = request.headers.get('X-Auth-Token');
      if (headerToken) {
        authToken = headerToken;
      }
    }
    
    // 3. Also check Authorization header
    if (!authToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7);
      }
    }
    
    if (!authToken) {
      console.error('No auth token found in cookie or header');
      return NextResponse.json(
        { success: false, message: 'Authentication token missing. Please log in again.' },
        { status: 401 }
      );
    }

    // Get the request body
    const payload = await request.json();

    // Forward the request to the backend API
    const response = await actotaApi.post(
      '/api/itineraries/featured/add',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Itinerary created - Backend response:', JSON.stringify(response.data, null, 2));
    
    // Get the MongoDB ID from the response if available, and add it directly to the response
    let mongoId;
    if (response.data && response.data._id) {
      if (typeof response.data._id === 'object' && response.data._id.$oid) {
        mongoId = response.data._id.$oid;
      } else {
        mongoId = response.data._id.toString();
      }
      console.log('Extracted MongoDB ID:', mongoId);
    }

    return NextResponse.json(
      { 
        success: true, 
        data: response.data,
        // Add the extracted ID as a separate property to make it easier to find
        itineraryId: mongoId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error uploading itinerary:', error);
    
    if (error.response) {
      
      return NextResponse.json(
        { 
          success: false, 
          message: error.response.data?.error || error.response.data?.message || 'Failed to upload itinerary',
          details: error.response.data
        },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}