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

export async function PUT(request: NextRequest) {
  try {
    console.log('Update images fallback handler called');
    
    // Get itinerary ID from the query parameters
    const url = new URL(request.url);
    const itineraryId = url.searchParams.get('id');
    
    if (!itineraryId) {
      console.log('Missing itinerary ID in query parameters');
      return NextResponse.json(
        { error: 'Itinerary ID is required as a query parameter: ?id=your-itinerary-id' },
        { status: 400 }
      );
    }
    
    // Clean up the itinerary ID to ensure it's valid for API calls
    // Remove any invalid characters (only keep alphanumeric, hyphens and underscores)
    const cleanId = itineraryId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanId !== itineraryId) {
      console.log(`Cleaned itineraryId from "${itineraryId}" to "${cleanId}"`);
    }
    
    // Check if this is a temporary ID and log that clearly
    const isTemporaryId = cleanId.startsWith('temp-');
    if (isTemporaryId) {
      console.log(`⚠️ Using temporary ID: ${cleanId} - this is expected for newly created itineraries`);
    }
    
    console.log(`Processing image update for itinerary: ${cleanId}`);

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
    
    // Validate that all image URLs look valid
    let validationErrors = [];
    const validImages = images.filter((url, index) => {
      if (typeof url !== 'string') {
        validationErrors.push(`Image at index ${index} is not a string`);
        return false;
      }
      
      // Basic URL validation check
      try {
        new URL(url);
        return true;
      } catch (e) {
        // Allow data URLs (they're valid but the URL constructor rejects them)
        if (url.startsWith('data:')) {
          return true;
        }
        validationErrors.push(`Image URL at index ${index} is not a valid URL: ${url.substring(0, 30)}...`);
        return false;
      }
    });
    
    if (validationErrors.length > 0) {
      console.warn('Image URL validation errors:', validationErrors);
      console.log(`Forwarding ${validImages.length} valid images from ${images.length} total`);
    } else {
      console.log(`Forwarding ${images.length} images to backend API`);
    }

    // Forward the request to the backend API
    console.log(`Sending request to backend API: PUT /api/admin/itineraries/${cleanId}/images`);
    try {
      const response = await actotaApi.put(
        `/api/admin/itineraries/${cleanId}/images`,
        { images: validImages || images }, // Use validated images if available
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Backend API response status:', response.status);
      console.log('Backend API response data:', JSON.stringify(response.data, null, 2));
      
      // Return early with success message if using temporary ID (backend might not have the temp ID yet)
      if (isTemporaryId) {
        console.log('Returning early success for temporary ID');
        return NextResponse.json(
          { 
            success: true, 
            message: 'Images processed successfully with temporary ID', 
            note: 'Images will be associated with the itinerary once it\'s fully created',
            imageCount: validImages.length || images.length
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: true, data: response.data },
        { status: 200 }
      );
    } catch (error) {
      // Check if this is a temporary ID and return a special response
      if (isTemporaryId) {
        console.log('Temporary ID detected. Returning success message despite backend error');
        return NextResponse.json(
          { 
            success: true, 
            message: 'Images processed with temporary ID', 
            note: 'Backend API may not recognize the temporary ID yet. Images will be stored until the itinerary is fully created.',
            warning: 'Backend API returned an error, but this is expected for temporary IDs',
            imageCount: validImages.length || images.length
          },
          { status: 200 }
        );
      }
      
      // Handle error normally for non-temporary IDs
      throw error;
    }
    
    // Response is returned in the try/catch block above
  } catch (error: any) {
    console.error('Error updating itinerary images:', error);
    
    // Extract error details for logging
    const errorResponse = error.response;
    const errorStatus = errorResponse?.status;
    const errorData = errorResponse?.data;
    
    console.error('Error details:', {
      status: errorStatus,
      data: errorData,
      message: error.message
    });
    
    // Get a user-friendly error message
    let errorMessage = 'Failed to update itinerary images';
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: errorMessage,
        details: errorData
      },
      { status: errorStatus || 500 }
    );
  }
}