export default async function get_activities() {
	try {
		const response = await fetch('/api/activities');
		const result = await response.json();
		return result;
	} catch (error) {
		return error;
	}
}
