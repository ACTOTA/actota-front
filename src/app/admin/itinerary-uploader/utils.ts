import { Activity, ObjectId, Location } from './types';

// Denver coordinates - used as default
export const DENVER_COORDINATES: [number, number] = [39.7392, -104.9903];

// City coordinates mapping
export const CITY_COORDINATES: Record<string, Record<string, [number, number]>> = {
  colorado: {
    denver: DENVER_COORDINATES,
    boulder: [40.0150, -105.2705],
    'colorado springs': [38.8339, -104.8214],
    aspen: [39.1911, -106.8175],
    vail: [39.6433, -106.3781]
  }
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (coords: [number, number]): string => {
  return `${coords[0]}, ${coords[1]}`;
};

/**
 * Parse coordinates from string input
 */
export const parseCoordinates = (input: string): [number, number] => {
  const parts = input.split(',').map(part => parseFloat(part.trim()));
  return parts.length === 2 ? [parts[0], parts[1]] : [0, 0];
};

/**
 * Get coordinates for a city and state if available
 */
export const getCityCoordinates = (city: string, state: string): [number, number] | null => {
  const normalizedState = state.toLowerCase();
  const normalizedCity = city.toLowerCase();
  
  if (CITY_COORDINATES[normalizedState] && CITY_COORDINATES[normalizedState][normalizedCity]) {
    return CITY_COORDINATES[normalizedState][normalizedCity];
  }
  
  return null;
};

/**
 * Extract an ObjectId string value from various MongoDB ID formats
 */
export const extractObjectId = (id: string | ObjectId): string => {
  if (typeof id === 'string') {
    return id;
  } else if (id && typeof id === 'object' && '$oid' in id) {
    // Handle MongoDB ObjectId format: { $oid: "..." }
    return id.$oid || '';
  }
  return '';
};

/**
 * Extract company name from an activity
 * Now handles the company field from the updated struct format
 */
export const extractCompanyName = (activity: Activity): string => {
  // First try the official company field from the struct
  if (activity.company) {
    return activity.company;
  }

  // Fall back to legacy fields if needed
  return (activity as any).vendor ||
         (activity as any).supplier ||
         '';
};

/**
 * Sort day numbers numerically
 */
export const sortDayNumbers = (dayNumbers: string[]): string[] => {
  return [...dayNumbers].sort((a, b) => parseInt(a) - parseInt(b));
};