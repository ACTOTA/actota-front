
export interface BookingType {
    _id?: Object; // Optional, matches skip_serializing_if
    user_id: Object;
    itinerary_id: Object;
    status: string;
    created_at?: Date; // Optional, matches Rust's DateTime
}

// export interface FeaturedVacation {
//     _id: Object  // MongoDB ObjectId as string
//     trip_name: string;
//     person_cost: number;
//     length_days: number;
//     length_hours: number;
//     start_location: Location;
//     end_location: Location;
//     description: string;
//     activities: Activity[];
//     images: string[];
//     created_at?: Date;
//     updated_at?: Date;
//   }
  
//   interface Location {
//     name: string;
//     coordinates: [number, number];  // Tuple of two numbers
//   }
  
//   interface Activity {
//     time: string;  // Time in format "HH:mm
//   }