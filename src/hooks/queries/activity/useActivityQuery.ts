import { useQuery } from '@tanstack/react-query';

interface Activity {
  // Define your activity type here
  id: string;
  // ... other fields
}

async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch('/api/activities', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }

  return response.json();
}

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });
}
