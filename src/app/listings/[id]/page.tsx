'use client';

import { usePathname } from 'next/navigation'
import { get_itinerary_by_id } from '@/src/services/api/itinerary';
import React, { useEffect, useState } from 'react';
import { FeaturedVacation } from '@/src/db/models/itinerary';
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { Theme } from '@/src/components/enums/theme';
import Button from '@/src/components/figma/Button';

export default function Itinerary() {
  const pathname = usePathname() as string;
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [listing, setListings] = useState<FeaturedVacation>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const fetchedListing = await get_itinerary_by_id(objectId);
        setListings(fetchedListing);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  // useEffect(() => {
  //   const name = listing;
  // }, [listing]);

  if (isLoading) {
    return <div className='text-white'>Loading...</div>;
  }

  if (!listing) {
    return <div className='text-white'>No data available</div>;
  }

  return (
    <section className='w-full h-full text-white px-9'>
      <div className='h-16' />
      <div className='flex items-center gap-2 my-6'>
        <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" />
        <p>Itineraries / <b>Denver Tour</b></p>
      </div>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>{listing.trip_name}</h1>
        <GlassPanel className='flex items-center justify-center w-10 h-10 rounded-full hover:cursor-pointer'>
          <HeartIcon className='h-6 w-6' />
        </GlassPanel>

      </div>
      <div className='grid grid-cols-7 gap-6 my-4'>
        <div className='col-span-5 flex flex-col gap-4 relative w-full h-[600px]'>
          <Image
            src={listing.images[0]}
            alt='Image of tour'
            width={928}
            height={640}
            sizes='100vw'
            className='w-full h-auto rounded-lg'
          />
          <div className='flex gap-4'>
            {listing.images.map((image, i) => (
              <div key={i}>
                <Image
                  src={image}
                  alt='Image of tour'
                  height={120}
                  width={120}
                  className='rounded-lg aspect-square object-cover'
                />
              </div>
            ))}
          </div>

          <div className='w-full h-full text-white my-8'>
            <h2><b>Overview</b></h2>
            <div className='grid grid-cols-2'>
              <div>
                <p>Start and End Date</p>
                <p>Group Size</p>
                <p>{listing.length_days} Days</p>
                <div>
                  <p>Destinations</p>
                </div>
              </div>
              <div>
                <p>Activities</p>
              </div>
            </div>
            <div className='my-8'>
              <h2><b>About</b></h2>
              <p className='text-neutral-04'>{listing.description}</p>
            </div>
          </div>

        </div>
        <div className='col-span-2'>
          <div className='neutral-02 rounded-lg p-4 flex flex-col justify-around gap-1 text-neutral-04'>
            <b className='text-white text-lg'>Reservation Details</b>
            <div><p>Activitiy costs</p></div>
            <div><p>Lodging costs</p></div>
            <div><p>Transport costs</p></div>
            <div><p>Service fee</p></div>
            <br />

            <div className='text-white font-bold flex justify-between'>
              <p>Total amount</p>
              <p>${listing.person_cost}</p>
            </div>
            <Button className='bg-white rounded-full p-2 text-black text-sm font-bold'>
              <p>Proceed to Payment</p>
              <ArrowRightIcon className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
