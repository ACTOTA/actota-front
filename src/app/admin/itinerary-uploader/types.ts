// Types for Itinerary Uploader
// Based on Rust backend structs

// Location with city, state, and coordinates
export interface Location {
  city: string;
  state: string;
  coordinates: [number, number];
}

// MongoDB ObjectId can come in different formats
export interface ObjectId {
  $oid?: string;  // MongoDB returns ObjectIds as { $oid: "..." }
}

// Interface for activity time slots
export interface TimeSlot {
  // Primary format in the API
  start?: string;        // Format: "HH:MM:SS" (24-hour)
  end?: string;          // Format: "HH:MM:SS" (24-hour)

  // Alternative format (originally expected)
  start_time?: string;   // Format: "HH:MM" (24-hour)
  end_time?: string;     // Format: "HH:MM" (24-hour)

  available?: boolean;   // Whether this slot is available
}

// Activity with its details
export interface Activity {
  _id: string | ObjectId;  // Can be a string or an ObjectId object
  company: string;
  company_id: string;
  booking_link: string;
  online_booking_status: string;
  guide?: string;
  title: string;
  description: string;
  activity_types: string[];
  tags: string[];
  price_per_person: number;  // Price per person in dollars
  duration_minutes: number;  // Duration in minutes
  daily_time_slots?: TimeSlot[];  // Array of available time slots
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  whats_included?: string[];
  weight_limit_lbs?: number;
  age_requirement?: number;
  height_requiremnt?: number;  // Note the typo matches backend struct
  blackout_date_ranges?: any[];  // Simplified for now
  capacity?: any;  // Simplified for now
  created_at?: string;
  updated_at?: string;
  // Legacy fields for compatibility
  location?: string;
  image_url?: string;
  vendor?: string;
  supplier?: string;
}

// Location for transportation items
export interface ItemLocation {
  name: string;
  coordinates: [number, number];
}

// Union type for different types of day items
export type DayItem =
  | {
      type: 'transportation';
      time: string; // Using string for time in frontend
      location: ItemLocation;
      name: string;
    }
  | {
      type: 'activity';
      time: string;
      activity_id: string; // Using string for ObjectId in frontend
      // Additional activity details
      activity_title?: string;
      activity_description?: string;
      activity_price?: number;
      activity_company?: string;
      activity_duration?: number;
    }
  | {
      type: 'accommodation';
      time: string;
      accommodation_id: string; // Using string for ObjectId in frontend
    };

// Main interface for Featured Vacation structure
export interface FeaturedVacation {
  trip_name: string;
  fareharbor_id?: number;
  min_age?: number;
  min_group: number;
  max_group: number;
  length_days: number;
  length_hours: number;
  start_location: Location;
  end_location: Location;
  description: string;
  days: { [key: string]: DayItem[] };
  day_durations?: Record<string, number>; // Per-day duration in hours
  images?: string[];
}

// Form errors shape
export interface FormErrors {
  trip_name: string;
  min_group: string;
  max_group: string;
  length_days: string;
  length_hours: string;
  start_location: string;
  end_location: string;
  description: string;
  days: string;
  images: string;
}

// For tracking active search items
export interface ActiveSearchItem {
  dayNumber: string;
  itemIndex: number; // -1 indicates day-level search
}

// Message type for notifications
export interface Message {
  type: 'success' | 'error';
  text: string;
}