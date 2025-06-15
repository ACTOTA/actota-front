
export interface BookingType {
    _id?: Object; // Optional, matches skip_serializing_if
    user_id: Object;
    itinerary_id: Object;
    status: string;
    created_at?: Date; // Optional, matches Rust's DateTime
    start_date?: string; // Start date of the booking
    end_date?: string; // End date of the booking
    arrival_datetime?: string; // Alternative field name for start date
    departure_datetime?: string; // Alternative field name for end date
    total_cost?: number; // Total cost of the booking
    payment_intent_id?: string; // Stripe payment intent ID
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