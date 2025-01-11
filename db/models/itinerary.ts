export interface FeaturedVacation {
  _id?: Object;
  trip_name: string;
  fareharbor_id: number;
  person_cost: number;
  min_age?: number;
  min_guests: number;
  max_guests: number;
  length_days: number;
  length_hours: number;
  start_location: Location;
  end_location: Location;
  description: string;
  days: Days;
  activities?: Activity[];
  images: string[];
  start_date?: Date;
  end_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Location {
  city: string;
  state: string;
  coordinates: [number, number];
}
export interface ActivityLocation {
  name: string;
  coordinates: [number, number];
}

interface Day {
  time: string; // Using string for time in format "HH:mm:ss"
  location: ActivityLocation;
  name: string;
  type: string;
}

interface Days {
  [key: string]: Day[];
}

interface Activity {
  label: string;
  description: string;
  tags: string[];
}
