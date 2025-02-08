'use client';

import React, { useEffect } from "react";
import ListingCard from "@/src/components/ListingCard";
import { FeaturedVacation } from "@/db/models/itinerary";
import axios from "axios";
import Button from "@/src/components/figma/Button";
export default function FeaturedItineraries() {
  const [listings, setListings] = React.useState<FeaturedVacation[]>([{
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }, {
    trip_name: "Lahore",
    fareharbor_id: 1,
    person_cost: 100,
    min_age: 18,
    min_guests: 1,
    max_guests: 10,
    length_days: 1,
    length_hours: 1,
    start_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    end_location: { city: "Lahore", state: "UK", coordinates: [1, 1] },
    description: "Lahore is a city in Pakistan",
    days: { "1": [{ time: "10:00:00", location: { name: "Lahore", coordinates: [1, 1] }, name: "Lahore", type: "Lahore is a city in Pakistan" }] },
    activities: [{ label: "Lahore", description: "Lahore is a city in Pakistan", tags: ["Lahore"] }],
    images: ["/images/hero-bg.jpg"],
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }]);
  const [isLoading, setIsLoading] = React.useState(true);

  // useEffect(() => {
  //   async function fetchListings() {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get("/api/itinerary");
  //       console.log("response", response.data);

  //     } catch (error) {
  //       console.error('Failed to fetch activities:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchListings();
  // }, []); // Empty dependency array means run once on mount

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <section className=" w-full text-white">
      <div className="max-w-[1440px] mx-auto p-[80px]">

        <div className=" flex items-center py-5">
          <h2 className="text-2xl font-bold">Itineraries for You</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {listings?.map((listing) => (
            <ListingCard
              // key={(listing._id as { $oid: string }).$oid}
              key={listing.trip_name}
              data={listing}
            />
          ))}
        </div>
        <div className="flex justify-center flex-col items-center pt-6">
          <p className="text-white text-xl font-bold">See More Itineraries</p>
          <Button variant="primary" className="bg-white text-black mt-4 ">Load More</Button>
        </div>
      </div>

    </section>
  );
}
