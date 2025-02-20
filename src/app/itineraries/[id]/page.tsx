'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { FeaturedVacation } from '@/db/models/itinerary';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ClockIcon, HeartIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Button from '@/src/components/figma/Button';
import DayView from './DayView';
import { getAuthCookie } from '@/src/helpers/auth';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { FaRegHeart } from 'react-icons/fa6';
import { CgSoftwareUpload } from 'react-icons/cg';
import { LuUsers } from 'react-icons/lu';
import { PiClockDuotone } from 'react-icons/pi';
import { GoHome } from 'react-icons/go';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import ActivityTag from '@/src/components/figma/ActivityTag';
import ListingsSlider from '@/src/components/ListingsSlider';
import LikeDislike from '@/src/components/LikeDislike';
import { useItineraryById } from '@/src/hooks/queries/itinerarieById/useItineraryByIdQuery';

export default function Itinerary() {
  const pathname = usePathname() as string;
  const router = useRouter();
  
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const { data, isLoading, error } = useItineraryById(objectId);
  
  // Access the actual itinerary data from the response
  const itineraryData = data?.data;
  
  const [listing, setListings] = useState<any>();


  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setListings(data.data);
    }
  }, [data]);

  if (!listing) {
    return <div className='text-white'>No data available</div>;
  }

  const handleBooking = () => {
    console.log("start_date", listing.start_date);
    if (!listing?.start_date) return;
    const timestamp = listing.start_date.getTime() / 1000;
    window.location.href = `https://fareharbor.com/embeds/book/adventurecoloradotours/items/${listing.fareharbor_id}/availability/${timestamp}/book/?full-items=yes&flow=345668`;
  };

  const handleSlideClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className='w-full !h-full text-white p-[64px] max-sm:px-6 max-lg:px-10 gap-4'>
      <div className='flex items-center gap-2 my-6 max-sm:hidden'>
        <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" onClick={() => router.push("/")} />
        <p className='text-primary-gray text-sm'>Itineraries / <span className='text-white'>Denver Tour</span></p>
      </div>
      <div className='flex gap-4 flex-col md:flex-row md:items-center  max-sm:hidden'>
        <h1 className='text-4xl font-bold me-auto'>{listing.trip_name}</h1>
        <div className='flex items-center md:flex-nowrap flex-wrap gap-2'>
          <LikeDislike />

          <Button variant="outline" size='md' className='gap-1' onClick={() => { }}>
            <CgSoftwareUpload className='h-6 w-6 text-white' />
            <p>Share</p>
          </Button>

          <Button variant="outline" size='md' className='gap-1' onClick={() => { }}>
            <LuUsers className='h-5 w-5 text-white' />
            <p className='text-nowrap'>Manage Members</p>
          </Button>
        </div>
      </div>

      <div className='flex max-sm:flex-col w-full gap-6 mt-4'>
        <div className=' flex flex-col gap-4 w-[67%] max-sm:w-full'>
          <ListingsSlider
            images={listing.images}
            currentIndex={currentIndex}
            onSlideClick={handleSlideClick}
          />

          <div className='w-full h-full text-white mt-8 max-sm:mt-0 relative'>
            <h1 className='text-2xl font-bold  sm:hidden'>{listing.trip_name}</h1>

            <h2 className='text-white text-xl'><b>Overview</b></h2>
            <div className='grid sm:grid-cols-2 mt-4'>
              <div>
                <p className='flex items-center gap-2 text-sm mb-3'><CalendarIcon className='h-5 w-5' /> 22 June 2024 - 24 June 2024</p>
                <p className='flex items-center gap-2 text-sm mb-3'><LuUsers className='h-5 w-5' />3 Adults</p>
                <p className='flex items-center gap-2 text-sm mb-3'><PiClockDuotone className='h-5 w-5' /> 72 Hours</p>
                <p className='flex items-center gap-2 text-sm mb-3'>Destination</p>
                <div className='flex items-center flex-wrap gap-2 text-sm mb-3'>
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-[#262626]"
                  >
                    Faisalabad, pakistan
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-[#262626]"
                  >
                    Faisalabad, pakistan
                  </button>
                </div>
              </div>
              <div>
                <p className='flex items-center gap-2 text-sm mb-3'><GoHome className='h-5 w-5' /> Start and End Date</p>
                <p className='flex items-center gap-2 text-sm mb-3'><MdOutlineDirectionsCarFilled className='h-5 w-5' /> Start and End Date</p>
                <p className='flex items-center gap-2 text-sm mb-3'>Activities</p>
                <div className='flex flex-wrap gap-2'>
                  {[{ label: "atving" }, { label: "campfire" }, { label: "camping" }, { label: "sightSeeing" }, { label: "campfire" }, { label: "camping" }, { label: "sightSeeing" }, { label: "campfire" }, { label: "camping" }, { label: "sightSeeing" },].map((activity, i) => (
                    <ActivityTag key={i} activity={activity.label} />
                  ))}
                </div>
              </div>
            </div>
            <div className='my-8 max-sm:mb-0'>
              <h2 className='text-white text-xl'><b>About</b></h2>
              <p className='text-primary-gray text-sm mt-2'>{listing?.description}</p>
            </div>
          </div>
        </div>
        <div className='w-[33%] max-sm:w-full'>
          <div className=' bg-[#141414] rounded-2xl'>
            <div className=' rounded-lg p-4 flex flex-col  gap-1 '>
              <b className='text-white text-lg mb-4'>Reservation Details</b>
              <div className='flex justify-between  mb-2'><p className='text-primary-gray'> Activitiy costs</p><p>${listing.person_cost}</p></div>
              <div className='flex justify-between mb-2'><p className='text-primary-gray'>Lodging costs</p><p>${listing.person_cost}</p></div>
              <div className='flex justify-between mb-2'><p className='text-primary-gray'>Transport costs</p><p>${listing.person_cost}</p></div>
              <div className='flex justify-between'><p className='text-primary-gray'>Service fee</p><p>${listing.person_cost}</p></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>

              <div className='text-white font-bold flex justify-between mb-4'>
                <p>Total amount</p>
                <p>${listing.person_cost}</p>
              </div>
              <Button onClick={() => router.push("/payment")} variant='primary' className=' text-black text-sm font-bold' >
                <p>Proceed to Payment</p>
                <ArrowRightIcon className='h-6 w-6' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className=" h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>
      <div className='flex-1 h-full w-full mt-8'>
        <DayView listing={listing} />
      </div>
    </section>
  );
}
