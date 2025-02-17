import { actotaApi } from '@/src/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
	try {

		const response = await actotaApi.get('/api/itineraries', {
			headers: {
				'Content-Type': 'application/json'
			},
		});


		const data = response.data;

		return NextResponse.json(data);
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch itineraries' },
			{ status: 500 }
		);
	}
}

