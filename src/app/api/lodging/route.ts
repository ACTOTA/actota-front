import actotaApi from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const response = await actotaApi.get('/api/lodging');

		return NextResponse.json({success: true,message: "Lodging fetched successfully", data: response.data});
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch lodging' },
			{ status: 500 }
		);
	}
}
