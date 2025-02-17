import { Itinerary } from '@/db/models/itinerary';
import { useQuery } from '@tanstack/react-query';

async function fetchItineraries(): Promise<Itinerary[]> {

	const response = await fetch('/api/itineraries', {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch activities');
	}

	return response.json();
}

export function useItineraries() {
	return useQuery({
		queryKey: ['itineraries'],
		queryFn: fetchItineraries,
	});
}
