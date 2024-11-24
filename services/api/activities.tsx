export default async function get_activities() {
	try {
		const response = await fetch('/api/activities/get');
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
