interface Activity {
  label: string;
  description: string;
  tags: string[];
}

interface Location {
  city: string;
  state: string;
  coordinates: number[];
}

export interface ItineraryData {
  _id: { $oid: string };
  fareharbor_id: string | null;
  trip_name: string;
  person_cost: number;
  min_age: number | null;
  min_group: number;
  max_group: number;
  length_days: number;
  length_hours: number;
  start_location: Location;
  end_location: Location;
  description: string;
  start_date: string;
  end_date: string;
  delay_insurance: boolean | null;
  days: Record<string, Array<{
    time: string;
    location: {
      name: string;
      coordinates: number[];
    };
    name: string;
    type: string;
  }>>;
  activities: Activity[];
  activity_cost: number;
  lodging_cost: number;
  transport_cost: number;
  service_fee: number;
  is_favorite: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
}
