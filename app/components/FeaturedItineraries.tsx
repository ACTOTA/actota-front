'use client';

import React, { useEffect } from "react";
import ListingCard from "../components/listings/ListingCard";
import { FeaturedVacation } from "@/db/models/itinerary";
import { get_featured } from "@/services/api/itinerary";

export default function FeaturedItineraries() {
  const [listings, setListings] = React.useState<FeaturedVacation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        const fetchedListing = await get_featured();
        setListings(fetchedListing);

        console.log('Fetched listings:', fetchedListing);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, []); // Empty dependency array means run once on mount

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="h-[100vh] px-8 py-4 text-white">
      <div className="h-12 flex items-center px-2">
        <h2 className="text-2xl font-bold">Itineraries for You</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 p-2">
        {listings?.map((listing) => (
          <ListingCard
            key={(listing._id as { $oid: string }).$oid}
            data={listing}
          />
        ))}
      </div>
    </section>
  );
}
