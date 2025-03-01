import { useQuery } from '@tanstack/react-query';

interface Lodging {
	// Define your activity type here
	id: string;
	// ... other fields
}

async function fetchLodging(): Promise<Lodging[]> {
	const response = await fetch('/api/lodging', {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch lodging');
	}

	return response.json();
}

export function useLodging() {
	return useQuery({
		queryKey: ['lodging'],
		queryFn: fetchLodging,
	});
}
