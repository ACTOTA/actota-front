export interface FeaturedVacation {
  _id?: Object;
  trip_name: string;
  person_cost: number;
  length_days: number;
  length_hours: number;
  start_location: Location;
  end_location: Location;
  description: string;
  days: Days;
  activities?: Activity[];
  images?: string[];
  created_at?: Date;
  updated_at?: Date;
}

interface Location {
  name: string;
  coordinates: [number, number];
}

interface Day {
  time: string; // Using string for time in format "HH:mm:ss"
  location: Location;
  name: string;
}

interface Days {
  [key: string]: Day[];
}

interface Activity {
  label: string;
  description: string;
  tags: string[];
}
