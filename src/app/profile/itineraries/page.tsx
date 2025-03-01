"use client";
import React, { useState } from "react";
import Button from "@/src/components/figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import MyItineraryCard from "@/src/components/profileComponents/my-itinerary/MyItineraryCard";
import Dropdown from "@/src/components/figma/Dropdown";

const MyItineraries = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = React.useState<any[]>([{
    id: 1,
    day_itinerary: true,
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
    id: 2,
    day_itinerary: false,
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
    id: 3,
    day_itinerary: false,
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
  ]);
  const tabs = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "fullItineraries",
      label: "Full Itineraries",
    },
    {
      id: "dayItineraries",
      label: "Day Itineraries",
    }
  ];

  
  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
        <div className="font-bold text-2xl">My Itineraries</div>
       
      {/* body section */}
      <div>
      <div className="mb-4 flex gap-2">
              <div className="w-full">

                <Input
                  placeholder="Select Your Bookings"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  icon={<FiSearch className="w-5 h-5" />}
                  className="px-3 py-2.5 "
                />
              </div>
              <div className="inline-flex">

                <Dropdown
                  options={["Newest", "Oldest"]}
                  onSelect={() => { }}
                  className="border-none !bg-[#141414]"
                  placeholder="Newest"
                />
              </div>
            </div>
        {favorites.filter((favorite) => favorite.day_itinerary === (activeTab === "dayItineraries") || activeTab === "all").map((favorite) => (
          <MyItineraryCard key={favorite.id} data={favorite} />
        ))}
      </div>
    </div>
  )
}

export default MyItineraries;