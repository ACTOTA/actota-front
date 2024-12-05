export default async function get_featured() {
	try {
		const response = await fetch('/api/itineraries/featured');
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
