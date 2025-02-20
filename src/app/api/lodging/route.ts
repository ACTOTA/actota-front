import { actotaApi } from '@/src/lib/apiClient';
import { NextResponse } from 'next/server';

export async function GET() {
	try {

		// TODO: Replace with Actota API
		// TODO: replace env public api url to use local host

		const response = await actotaApi.get('/api/lodging', {
			headers: {
				'Content-Type': 'application/json',
				// TODO: put hardcoded token as for now
				// "Authorization": `Bearer ${session.token}`
			},
		});


		const data = response.data;

		return NextResponse.json(data);
	} catch (error) {
		console.error('Fetch error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch activities' },
			{ status: 500 }
		);
	}
}
