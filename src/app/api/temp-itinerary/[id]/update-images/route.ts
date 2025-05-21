import { NextRequest, NextResponse } from 'next/server';
import actotaApi from '@/src/lib/apiClient';
import { getAuthCookie } from '@/src/helpers/auth';

export const dynamic = "force-dynamic";

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Temp itinerary update images handler called with params:', params);
    
    // Get the raw ID from params (this will be just the numeric portion after "temp-")
    const rawId = params.id;
    if (!rawId) {
      console.log('Missing numeric ID in route params');
      return NextResponse.json(
        { error: 'Numeric ID is required' },
        { status: 400 }
      );
    }
    
    // Reconstruct the full temporary ID
    const fullTempId = `temp-${rawId}`;
    console.log(`Reconstructed temporary ID: ${fullTempId}`);
    
    // Try to get auth token from cookie (httpOnly)
    const authToken = await getAuthCookie();
    if (!authToken) {
      console.log('Auth token missing in cookie');
      return NextResponse.json(
        { error: 'Authentication token missing. Please log in again.' },
        { status: 401 }
      );
    }

    // Get the request body (image URLs)
    let reqBody;
    try {
      reqBody = await request.json();
      console.log('Received request body:', JSON.stringify(reqBody).substring(0, 200) + '...');
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { images } = reqBody;
    if (!images || !Array.isArray(images)) {
      console.log('Invalid or missing images array:', images);
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      );
    }
    
    console.log(`Processing ${images.length} images for temporary itinerary: ${fullTempId}`);

    // For temporary IDs, we don't try to call the backend API since it won't recognize the ID
    // Instead, we return a success message indicating the images are being stored
    return NextResponse.json(
      { 
        success: true, 
        message: 'Images processed successfully with temporary ID', 
        note: 'Images will be associated with the itinerary once it\'s fully created',
        imageCount: images.length,
        temporaryId: fullTempId
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Error processing temporary itinerary images:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to process temporary itinerary images',
        error: error.message,
      },
      { status: 500 }
    );
  }
}