"use client";
import React, { useState } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import FavoritesCard from "./FavoritesCard";
import Dropdown from "../../figma/Dropdown";
import Image from "next/image";

const Favorites = () => {
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

  const renderContent = () => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    return (
      <div>
        {favorites.filter((favorite) => favorite.day_itinerary === (activeTab === "dayItineraries") || activeTab === "all").map((favorite) => (
          <FavoritesCard key={favorite.id} data={favorite} />
        ))}
      </div>
    )
  };
  return (
    <div className="flex flex-col gap-8">
      {/* header section */}
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl">Favorites</div>
        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="outline"
                size="sm"
                className={
                  activeTab === tab.id
                    ? "!border-white !text-white"
                    : "!border-border-primary !text-border-primary"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

        </div>
      </div>
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
          <div className="inline-flex ">

            <Dropdown label={<div className="flex items-center gap-1">
              <div className=" h-5 w-5">

                <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
              </div>
            </div>} options={["Lowest Price", "Highest Price", "Any Duration"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

export default Favorites