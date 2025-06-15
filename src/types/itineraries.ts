interface Activity {
  label: string;
  description: string;
  tags: string[];
}

interface TimeSlot {
  start: string; // Will be serialized as ISO time string
  end: string;   // Will be serialized as ISO time string
}

interface Address {
  street: string;
  unit?: string; // Optional field
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Capacity {
  minimum: number;
  maximum: number;
}

interface ItemLocation {
  name: string;
  coordinates: [number, number]; // Tuple of two numbers
}

// Base interface with common properties
export interface BaseDayItem {
  type: string;
  time: string; // ISO time string
  location: ItemLocation;
}

// Activity specific interface
export interface ActivityItem extends BaseDayItem {
  type: "activity";
  _id?: string;
  company: string;
  company_id: string;
  booking_link: string;
  online_booking_status: string;
  title: string;
  description: string;
  activity_types: string[];
  tags: string[];
  price_per_person: number;
  duration_minutes: number;
  daily_time_slots: TimeSlot[];
  address: Address;
  whats_included: string[];
  weight_limit_lbs?: number;
  age_requirement?: number;
  height_requirement?: number;
  capacity: Capacity;
  primary_image: string;
  images: string[];
}

// Accommodation specific interface
export interface AccommodationItem extends BaseDayItem {
  type: "accommodation";
  _id?: string;
  name: string;
  address?: string;
  price_per_night?: number;
  amenities?: string[];
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

// Transportation specific interface
export interface TransportationItem extends BaseDayItem {
  type: "transportation";
  name: string;
}

// Union type using the specific interfaces
export type PopulatedDayItem = ActivityItem | AccommodationItem | TransportationItem;

// Type guard functions to help with type narrowing
export function isActivity(item: PopulatedDayItem): item is ActivityItem {
  return item.type === "activity";
}

export function isAccommodation(item: PopulatedDayItem): item is AccommodationItem {
  return item.type === "accommodation";
}

export function isTransportation(item: PopulatedDayItem): item is TransportationItem {
  return item.type === "transportation";
}

interface Location {
  city: string;
  state: string;
  coordinates: [number, number]; // Tuple of two numbers
}

export interface ItineraryData {
  _id: { $oid: string };
  fareharbor_id?: string | null;
  trip_name: string;
  person_cost: number;
  min_age?: number | null;
  min_group: number;
  max_group: number;
  length_days: number;
  length_hours: number;
  start_location: Location;
  end_location: Location;
  description: string;
  images: string[];
  // Specific to frontend
  is_favorite: boolean;
  activity_cost: number;
  lodging_cost: number;
  transport_cost: number;
  service_fee: number;
  activities: Activity[];
  start_date: string;
  delay_insurance: string;

  created_at: string;
  updated_at: string;

  // The populated days field
  days: Record<string, PopulatedDayItem[]>;
  
  // Additional properties needed by components
  total_cost?: number;
  lodging?: Array<any>;
}
