import actotaApi from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {

    const response = await actotaApi.get('/activities');

    return NextResponse.json({success: true,message: "Activities fetched successfully", data: response.data});
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}