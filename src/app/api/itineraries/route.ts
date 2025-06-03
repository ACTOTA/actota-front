import actotaApi from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {

    const response = await actotaApi.get('/itineraries/featured');

    const data = response.data;

    return NextResponse.json({success: true, message: "Itineraries fetched successfully", data: data});
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}
