import { serverApiClient } from '@/src/lib/serverApiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await serverApiClient.get('/lodging');
    const data = await response.json();

    return NextResponse.json({success: true, message: "Lodging fetched successfully", data: data});
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lodging' },
      { status: 500 }
    );
  }
}
