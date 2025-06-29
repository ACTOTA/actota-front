import { serverApiClient } from '@/src/lib/serverApiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await serverApiClient.get('/activities');
    const data = await response.json();

    // Return activities in the format expected by the filter component
    return NextResponse.json({
      success: true, 
      message: "Activities searched successfully", 
      activities: data || []
    });
  } catch (error) {
    console.error('Activities search error:', error);
    return NextResponse.json(
      { error: 'Failed to search activities', activities: [] },
      { status: 500 }
    );
  }
}