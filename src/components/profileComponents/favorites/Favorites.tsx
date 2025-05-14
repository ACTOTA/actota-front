"use client";
import React, { useState } from "react";
import Button from "../../figma/Button";
import Link from "next/link";
import Input from "@/src/components/figma/Input";
import { FiSearch } from "react-icons/fi";
import FavoritesCard from "./FavoritesCard";
import Dropdown from "../../figma/Dropdown";
import Image from "next/image";
import ListingCard from "../../ListingCard";
import { useFavorites } from "@/src/hooks/queries/account/useFavoritesQuery";

const Favorites = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Lowest Price");
  const { data: favoriteItineraries, isLoading, error } = useFavorites();

  console.log('favoriteItineraries', favoriteItineraries);

  const filteredFavorites = React.useMemo(() => {
    if (!favoriteItineraries) return [];

    // First filter based on search and tab
    const filtered = favoriteItineraries.filter((favorite: any) => {
      const matchesSearch = favorite.trip_name.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" ||
        (activeTab === "dayItineraries" && favorite.length_days === 1) ||
        (activeTab === "fullItineraries" && favorite.length_days > 1);

      return matchesSearch && matchesTab;
    });

    // Then sort based on the selected option
    return [...filtered].sort((a, b) => {
      const priceA = a.person_cost || 0;
      const priceB = b.person_cost || 0;
      
      if (sortOption === "Lowest Price") {
        return priceA - priceB;
      } else if (sortOption === "Highest Price") {
        return priceB - priceA;
      }
      return 0;
    });
  }, [favoriteItineraries, search, activeTab, sortOption]);

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
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!filteredFavorites.length) return <div>No favorites found</div>;

    return (
      <div>
        {filteredFavorites.map((favorite: any) => (
          <FavoritesCard key={favorite._id.$oid} data={favorite} />
        ))}
      </div>
    );
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
              placeholder="Select Your Favorites"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              icon={<FiSearch className="w-5 h-5" />}
              className="px-3 py-2.5 "
            />
          </div>
          <div className="inline-flex ">

            <Dropdown 
              label={<div className="flex items-center gap-1">
                <div className="h-5 w-5">
                  <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
                </div>
              </div>} 
              options={["Lowest Price", "Highest Price", "Any Duration"]} 
              onSelect={(option: string) => setSortOption(option)} 
              className="border-none !bg-[#141414] rounded-lg" 
            />
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

export default Favorites
