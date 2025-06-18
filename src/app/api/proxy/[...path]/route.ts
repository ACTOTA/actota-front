import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedRequest } from '@/src/lib/googleAuth';

// Base URL for the ACTOTA API
const API_BASE_URL = process.env.ACTOTA_API_URL || 'https://api.actota.com';

/**
 * Proxy all requests to the ACTOTA API with authentication
 * This allows client-side code to make requests through this proxy
 * which handles the Google Cloud authentication server-side
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the API path
    const apiPath = params.path.join('/');
    const url = `${API_BASE_URL}/api/${apiPath}`;
    
    // Get the request body if it exists
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const requestBody = await request.text();
        body = requestBody || undefined;
      } catch (error) {
        // Body might be empty, that's okay
        body = undefined;
      }
    }

    // Forward query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Make authenticated request to the backend API
    const response = await makeAuthenticatedRequest(fullUrl, {
      method: request.method,
      body,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
    });

    // Get response body
    const responseBody = await response.text();
    
    // Create response with same status and headers
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant headers from the original response
    response.headers.forEach((value, key) => {
      // Skip headers that NextJS handles automatically
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error('API Proxy Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy request to backend API',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP methods
export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

