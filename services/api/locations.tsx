
export default async function get_locations(limit?: number, search?: string) {
	try {
		let url = '/api/locations';

		if (limit) {
			url += `?limit=${limit}`;
		}
		if (search) {
			url += `&search=${search}`;
		}

		const response = await fetch(url);
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
