export async function get_featured() {
	try {
		const response = await fetch('/api/itineraries/featured');
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}

export async function get_itinerary_by_id(id: string) {
	try {
		const response = await fetch(`/api/itineraries/${id}`);
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
