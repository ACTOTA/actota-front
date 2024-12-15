import { getAuthCookie } from "@/app/actions/getAuthCookie";

export async function get_featured() {
	try {
		const token = await getAuthCookie();

		const response = await fetch('/api/itineraries/featured', {
			headers: {
				'Authorization': `Bearer ${token}`
			},
			cache: 'no-store'
		});
		const result = await response.json();

		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		return { error: 'Failed to fetch featured itineraries' };
	}
}

export async function get_itinerary_by_id(id: string) {
	try {
		const token = await getAuthCookie();

		const response = await fetch(`/api/itineraries/${id}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			},
			cache: 'no-store'
		});

		const result = await response.json();
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		return { error: 'Failed to fetch itinerary' };
	}
}
