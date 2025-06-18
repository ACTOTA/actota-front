import { serverApiClient } from '@/src/lib/serverApiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Test connection to backend
    const response = await serverApiClient.get('/health');
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Frontend health check passed, backend connection successful",
      backend_status: data
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Backend connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

