import { Activity, ObjectId, Location, DayItem } from './types';

// Define interface for the formatted result
interface FormattedResult {
  trip_name: string;
  fareharbor_id?: number;
  min_age?: number;
  min_group: number;
  max_group: number;
  length_days: number;
  length_hours: number;
  start_location: {
    city: string;
    state: string;
    coordinates: number[];
  };
  end_location: {
    city: string;
    state: string;
    coordinates: number[];
  };
  description: string;
  days: { [key: string]: any[] };
  images: any[];
  [key: string]: any; // Add index signature
}

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
 * Convert a plain JavaScript value to MongoDB BSON format
 */
export const toBsonValue = (value: any): any => {
  if (value === null || value === undefined) {
    return value;
  }
  
  if (typeof value === 'number') {
    // Check if it's an integer or float
    if (Number.isInteger(value)) {
      return { $numberInt: value.toString() };
    } else {
      return { $numberDouble: value.toString() };
    }
  }
  
  if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
    // MongoDB ObjectId
    return { $oid: value };
  }
  
  if (value instanceof Date) {
    return { $date: { $numberLong: value.getTime().toString() } };
  }
  
  if (Array.isArray(value)) {
    return value.map(toBsonValue);
  }
  
  if (typeof value === 'object') {
    const result: any = {};
    for (const key in value) {
      result[key] = toBsonValue(value[key]);
    }
    return result;
  }
  
  return value;
};

/**
 * Convert the form data to the expected backend format
 */
export const formatPayloadForBackend = (formData: any): FormattedResult => {
  // Convert to plain JSON format - the backend expects regular JSON, not BSON
  // Don't include timestamps - let the backend handle them
  const result: FormattedResult = {
    trip_name: formData.trip_name,
    fareharbor_id: formData.fareharbor_id || undefined,
    min_age: formData.min_age ? Math.round(Number(formData.min_age)) : undefined,
    min_group: Math.round(Number(formData.min_group)),
    max_group: Math.round(Number(formData.max_group)),
    length_days: Math.round(Number(formData.length_days)),
    length_hours: Math.round(Number(formData.length_hours)),
    start_location: {
      city: formData.start_location.city,
      state: formData.start_location.state,
      coordinates: formData.start_location.coordinates.map((coord: number | string) => Number(coord))
    },
    end_location: {
      city: formData.end_location.city,
      state: formData.end_location.state,
      coordinates: formData.end_location.coordinates.map((coord: number | string) => Number(coord))
    },
    description: formData.description,
    days: {},
    images: formData.images || []
  };
  
  // Format days - ensure we only include expected fields
  for (const [dayNum, dayItems] of Object.entries(formData.days)) {
    const formattedItems = (dayItems as any[]).map((item: any) => {
      // Ensure time has seconds
      let timeWithSeconds = item.time;
      if (timeWithSeconds && timeWithSeconds.split(':').length === 2) {
        timeWithSeconds += ':00';
      }
      
      // Start with minimal structure
      const formattedItem: any = {
        time: timeWithSeconds,
        type: item.type
      };
      
      // Add type-specific fields
      switch (item.type) {
        case 'activity':
          if (item.activity_id) {
            formattedItem.activity_id = String(item.activity_id);
          }
          break;
          
        case 'transportation':
          formattedItem.name = item.name || '';
          formattedItem.location = {
            name: item.location?.name || '',
            coordinates: (item.location?.coordinates || [0, 0]).map((coord: number | string) => Number(coord))
          };
          break;
          
        case 'accommodation':
          if (item.accommodation_id) {
            formattedItem.accommodation_id = String(item.accommodation_id);
          }
          break;
      }
      
      return formattedItem;
    });
    
    result.days[dayNum] = formattedItems;
  }
  
  // Remove any undefined fields
  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });
  
  return result;
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