'use client';

import React, { useEffect } from "react";
import ListingCard from "../components/listings/ListingCard";

export default function FeaturedItineraries() {
 

  return (
    <section className="h-[100vh] px-8 py-4 text-white">
      <div className="h-12 flex items-center px-2">
        <h2 className="text-2xl font-bold">Itineraries for You</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 p-2">
       listings
      </div>
    </section>
  );
}
