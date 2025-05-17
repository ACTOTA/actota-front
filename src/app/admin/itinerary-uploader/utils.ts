import { Activity, ObjectId, Location, DayItem } from './types';

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

/**
 * Convert time string (HH:MM or HH:MM:SS) to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const parts = time.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Check if a time slot conflicts with existing activities
 * @param timeSlot Time slot to check in HH:MM format
 * @param dayItems All items for the day
 * @param currentItemIndex Index of the current item (to exclude from check)
 * @returns boolean indicating if the time slot conflicts
 */
export const isTimeConflicting = (
  timeSlot: string, 
  dayItems: DayItem[], 
  currentItemIndex: number
): boolean => {
  const timeInMinutes = timeToMinutes(timeSlot);
  
  // Check each activity to see if the time slot would conflict with it
  for (let i = 0; i < dayItems.length; i++) {
    // Skip checking against the current item
    if (i === currentItemIndex) continue;
    
    const item = dayItems[i];
    // Only check activity items with durations
    if (item.type === 'activity' && (item as any).activity_duration) {
      const activityTime = timeToMinutes(item.time);
      const durationHours = parseFloat((item as any).activity_duration) || 0;
      const durationMinutes = durationHours * 60;
      
      // Add 5% buffer to duration
      const bufferMinutes = durationMinutes * 1.05;
      const activityEndTime = activityTime + bufferMinutes;
      
      // Time conflict scenarios:
      // 1. New time starts during an existing activity (including buffer)
      // 2. New activity would run into an existing activity's time
      if (timeInMinutes >= activityTime && timeInMinutes < activityEndTime) {
        return true;
      }
      
      // Check if the activity we're evaluating would overlap with existing activities
      if ((item as any).activity_duration) {
        const newDurationHours = parseFloat((item as any).activity_duration) || 0;
        const newDurationMinutes = newDurationHours * 60;
        const newActivityEndTime = timeInMinutes + newDurationMinutes * 1.05; // With 5% buffer
        
        if (activityTime >= timeInMinutes && activityTime < newActivityEndTime) {
          return true;
        }
      }
    }
  }
  
  return false;
};