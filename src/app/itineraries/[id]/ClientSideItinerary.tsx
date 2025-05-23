'use client';

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from '@heroicons/react/20/solid';
import Button from '@/src/components/figma/Button';
import DayView from './DayView';
import { CgSoftwareUpload } from 'react-icons/cg';
import { LuUsers } from 'react-icons/lu';
import { PiClockDuotone } from 'react-icons/pi';
import { GoHome } from 'react-icons/go';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import ActivityTag from '@/src/components/figma/ActivityTag';
import ListingsSlider from '@/src/components/ListingsSlider';
import LikeDislike from '@/src/components/LikeDislike';
import { useItineraryById } from '@/src/hooks/queries/itinerarieById/useItineraryByIdQuery';
import { useFavorites } from '@/src/hooks/queries/account/useFavoritesQuery';
import Image from 'next/image';
import { ItineraryData } from '@/src/types/itineraries';

interface ClientSideItineraryProps {
  initialData: ItineraryData;
}

export default function ClientSideItinerary({ initialData }: ClientSideItineraryProps) {
  const pathname = usePathname() as string;
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itineraryData, setItineraryData] = useState<ItineraryData>(initialData);

  const { data: apiResponse, isLoading, error } = useItineraryById(objectId);

  const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
  useEffect(() => {
    if (apiResponse) {
      const filteredItineraryData = favorites?.some((favorite: any) => favorite._id.$oid === apiResponse._id.$oid) ? { ...apiResponse, isFavorite: true } : apiResponse;
      setItineraryData(filteredItineraryData);
    }
  }, [apiResponse]);

  const basePrice = (itineraryData?.person_cost ?? 0) * (itineraryData?.min_group ?? 1);


  if (error) {
    console.error('Error details:', error);
    return <div className='text-white flex justify-center items-center h-screen'>
      {user ? 'Error: ' + error.message : 'Please login to view itinerary details'}
    </div>;
  }


  const handleBooking = () => {
    router.push(`/payment/${itineraryData._id.$oid}`);
    // if (!itineraryData.fareharbor_id) return;
    // const timestamp = new Date().getTime() / 1000;
    // window.location.href = `https://fareharbor.com/embeds/book/adventurecoloradotours/items/${itineraryData.fareharbor_id}/availability/${timestamp}/book/?full-items=yes&flow=345668`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className='w-full !h-full text-white p-[64px] max-sm:px-6 max-lg:px-10 gap-4'>
      <div className='flex items-center gap-2 my-6 max-sm:hidden'>
        <ArrowLeftIcon className="h-6 w-6 hover:cursor-pointer" onClick={() => router.back()} />
        <p className='text-primary-gray text-sm'>Itineraries / <span className='text-white'>{itineraryData.trip_name}</span></p>
      </div>

      <div className='flex gap-4 flex-col md:flex-row md:items-center max-sm:hidden'>
        <h1 className='text-4xl font-bold me-auto'>{itineraryData.trip_name}</h1>
        <div className='flex items-center md:flex-nowrap flex-wrap gap-2'>


          <LikeDislike className='border border-primary-gray rounded-full  h-[50px] w-[50px]' liked={itineraryData?.is_favorite ? itineraryData?.is_favorite : false} favoriteId={itineraryData?._id.$oid} />
          <Button onClick={() => { router.push(`?modal=shareModal&itineraryId=${itineraryData._id.$oid}`) }} variant="outline" size='md' className='gap-1'>
            <CgSoftwareUpload className='h-6 w-6 text-white' />
            <p>Share</p>
          </Button>
          <Button variant="outline" size='md' className='gap-1'>
            <LuUsers className='h-5 w-5 text-white' />
            <p className='text-nowrap'>Manage Members</p>
          </Button>
        </div>
      </div>

      <div className='flex max-sm:flex-col w-full gap-6 mt-4'>
        <div className='flex flex-col gap-4 w-[67%] max-sm:w-full'>

          {itineraryData?.images?.length <= 1 ? <div className='w-full aspect-[926/640] relative'>
            <Image
              src={itineraryData?.images[0] ? itineraryData?.images[0] : '/images/default-itinerary.jpeg'}
              alt={`${itineraryData.trip_name} - Image ${1}`}
              fill
              priority
              className='rounded-lg object-cover'
              sizes='(max-width: 1536px) 71vw'
            />
          </div> :

            <ListingsSlider
              listing={itineraryData}
              currentIndex={currentIndex}
              onSlideClick={setCurrentIndex}
            />
          }
          <div className='w-full h-full text-white mt-8 max-sm:mt-0 relative'>
            <h1 className='text-2xl font-bold sm:hidden'>{itineraryData.trip_name}</h1>

            <h2 className='text-white text-xl'><b>Overview</b></h2>
            <div className='grid sm:grid-cols-2 mt-4'>
              <div>
                <p className='flex items-center gap-2 text-sm mb-3'>
                  <CalendarIcon className='h-5 w-5' /> {formatDate(itineraryData.created_at)}
                </p>
                <p className='flex items-center gap-2 text-sm mb-3'>
                  <LuUsers className='h-5 w-5' />{itineraryData.min_group}-{itineraryData.max_group} People
                </p>
                <p className='flex items-center gap-2 text-sm mb-3'>
                  <PiClockDuotone className='h-5 w-5' /> {itineraryData.length_hours} Hours
                </p>
                <p className='flex items-center gap-2 text-sm mb-3'>Destination</p>
                <div className='flex items-center flex-wrap gap-2 text-sm mb-3'>
                  <button type="button" className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-[#262626]">
                    {itineraryData.start_location?.city}, {itineraryData.start_location?.state}
                  </button>
                  {itineraryData.end_location?.city !== itineraryData.start_location?.city && (
                    <button type="button" className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-[#262626]">
                      {itineraryData.end_location?.city}, {itineraryData.end_location?.state}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className='flex items-center gap-2 text-sm mb-3'>
                  <GoHome className='h-5 w-5' /> Start: {itineraryData.start_location.city}
                </p>
                <p className='flex items-center gap-2 text-sm mb-3'>
                  <MdOutlineDirectionsCarFilled className='h-5 w-5' /> End: {itineraryData.end_location.city}
                </p>
                <p className='flex items-center gap-2 text-sm mb-3'>Activities</p>
                <div className='flex flex-wrap gap-2'>
                  {itineraryData?.activities?.map((activity, i) => (
                    <ActivityTag key={i} activity={activity.label} />
                  ))}
                </div>
              </div>
            </div>
            <div className='my-8 max-sm:mb-0'>
              <h2 className='text-white text-xl'><b>About</b></h2>
              <p className='text-primary-gray text-sm mt-2'>{itineraryData.description}</p>
            </div>
          </div>
        </div>
        {/* reservation details */}
        <div className='w-[33%] max-sm:w-full'>
          <div className='bg-[#141414] rounded-2xl'>
            <div className='rounded-lg p-4 flex flex-col gap-1'>
              <b className='text-white text-lg mb-4'>Reservation Details</b>
              <div className='flex justify-between mb-2'>
                <p className='text-primary-gray'>Activity costs</p>
                <p>${itineraryData?.activity_cost || 0}</p>
              </div>
              <div className='flex justify-between mb-2'>
                <p className='text-primary-gray'>Lodging costs</p>
                <p>${itineraryData?.lodging_cost || 0}</p>
              </div>
              <div className='flex justify-between mb-2'>
                <p className='text-primary-gray'>Transport costs</p>
                <p>${itineraryData?.transport_cost || 0}</p>
              </div>
              <div className='flex justify-between'>
                <p className='text-primary-gray'>Service fee</p>
                <p>${itineraryData?.service_fee || 0}</p>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>
              <div className='text-white font-bold flex justify-between mb-4'>
                <p>Total amount</p>
                <p>${basePrice}</p>
              </div>
              <Button onClick={handleBooking} variant='primary' className='text-black text-sm font-bold'>
                <p>Proceed to Payment</p>
                <ArrowRightIcon className='h-6 w-6' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent my-2"></div>

      <div className='flex-1 h-full w-full mt-8'>
        <DayView listing={itineraryData} />
      </div>
    </section>
  );
}
