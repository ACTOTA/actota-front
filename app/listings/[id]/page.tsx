'use client';

import { usePathname } from 'next/navigation'
import { get_itinerary_by_id } from '@/services/api/itinerary';
import React, { useEffect } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';


export default function Itinerary() {

  const pathname = usePathname() as string
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1)

  const [listing, setListing] = React.useState<FeaturedVacation>();

  useEffect(() => {
    async function fetchListings() {
      try {
        const fetchedListing = await get_itinerary_by_id(objectId);
        setListing(fetchedListing);

        console.log('Fetched listings:', fetchedListing);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    }

    fetchListings();

    console.log('objectId:', listing);
  }, []);

  return (
    <div>
      <h1>Itinerary</h1>
    </div>
  );
}
