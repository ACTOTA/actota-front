export default async function get_lodging() {
	try {
		const response = await fetch('/api/lodging/get');
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
