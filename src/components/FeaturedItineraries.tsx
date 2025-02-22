'use client';

import React, { useEffect, useState } from "react";
import ListingCard from "@/src/components/ListingCard";
import Button from "@/src/components/figma/Button";
import Dropdown from "./figma/Dropdown";
import Image from "next/image";
import { useItineraries } from "../hooks/queries/itineraries/useItineraryQuery";

export default function FeaturedItineraries() {
  const { data: itineraries, isLoading: itinerariesLoading, error: itinerariesError } = useItineraries();
  const [listings, setListings] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedActivity, setSelectedActivity] = useState([]);
 
  useEffect(() => {
    if (itineraries) {
      setListings(itineraries?.data);
    }
  }, [itineraries]);

  return (
    <section className=" w-full text-white">
      <div className="max-w-[1440px] mx-auto p-[80px] max-lg:px-8 max-sm:px-4 ">

        <div className=" flex justify-between items-center flex-wrap py-5">
          <h2 className="text-2xl font-bold">Itineraries for You</h2>
          <div className="flex items-center flex-wrap max-sm:justify-between gap-4">
            <div>

              <Dropdown label={<div className="flex items-center gap-1">
                <Image src="/svg-icons/leaf.svg" alt="dropdown-arrow" width={24} height={24} />
                <p className="text-primary-gray text-sm  mr-5">Theme</p>
              </div>} options={["popular", "new", "old"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />
            </div>
            <div>

              <Dropdown label={<div className="flex items-center gap-1">
                <div>

                  <Image src="/svg-icons/doller-coin.svg" alt="dropdown-arrow" width={24} height={24} />
                </div>
              </div>} options={["$50-$10,000", "$50-$10,000", "$50-$10,000"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />

            </div>
            <div>

              <Dropdown label={<div className="flex items-center gap-1">
                <div>

                  <Image src="/svg-icons/clock.svg" alt="dropdown-arrow" width={24} height={24} />
                </div>
              </div>} options={["Any Duration", "Any Duration", "Any Duration"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />

            </div>

            <div>

              <Dropdown label={<div className="flex items-center gap-1">
                <div>

                  <Image src="/svg-icons/chevron-selector.svg" alt="dropdown-arrow" width={24} height={24} />
                </div>
              </div>} options={["Lowest Price", "Highest Price", "Any Duration"]} onSelect={() => { }} className="border-none !bg-[#141414] rounded-lg" />

            </div>


          </div>

        </div>
        <div className="flex flex-wrap justify-start max-sm:justify-center gap-4">
        {itinerariesLoading && <div className="text-white text-center w-full">Loading...</div>}
        {itinerariesError && <div className="text-white text-center w-full">Error: {itinerariesError.message}</div>}
          {listings.length > 0 && listings?.map((listing) => (
            <ListingCard
              key={(listing._id as { $oid: string }).$oid}
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
