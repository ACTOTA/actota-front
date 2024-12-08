'use client';

import { usePathname } from 'next/navigation'
import { get_itinerary_by_id } from '@/services/api/itinerary';
import React, { useEffect } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';


export default function Itinerary() {

  const pathname = usePathname() as string
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [listings, setListings] = React.useState<FeaturedVacation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        const fetchedListing = await get_itinerary_by_id(objectId);
        setListings(fetchedListing);

        console.log('Fetched listings:', listings);
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
    <div>
      <h1>Itinerary</h1>
    </div>
  );
}
