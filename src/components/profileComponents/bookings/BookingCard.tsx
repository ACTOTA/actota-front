'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import GlassPanel from '@/src/components/figma/GlassPanel';
import { FaCheck, FaPersonWalking } from 'react-icons/fa6';
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { CgArrowTopRight } from "react-icons/cg";
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import moment from 'moment';
import { BookingType } from '../../models/Itinerary';
import { ItineraryData } from '@/src/types/itineraries';

interface ListingCardProps {
  dataBooking: BookingType | null;
  dataItinerary: ItineraryData | null;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  bookingConfirmedModal?: boolean;
  bookingDetailsPage?: boolean;
}

const BookingCard: React.FC<ListingCardProps> = ({
  dataBooking,
  dataItinerary,
  onAction,
  disabled = false,
  actionLabel,
  actionId = "",
  bookingConfirmedModal = false,
  bookingDetailsPage = false,
}) => {
  const router = useRouter();

  useEffect(() => {
    console.log("BookingCard dataBooking:", dataBooking);
    console.log("BookingCard dataItinerary:", dataItinerary);
  }, [])

  const handleDetailsClick = () => {
    if (!dataBooking || !dataBooking._id) {
      console.error('No booking ID available');
      return;
    }
    
    // Extract booking ID
    const bookingId = typeof dataBooking._id === 'object' && dataBooking._id.$oid 
      ? dataBooking._id.$oid 
      : dataBooking._id.toString();
      
    // Navigate to the booking details page with the ID
    router.push(`/bookings/${bookingId}`);
  };

  const handleCancelClick = () => {
    // Store booking and itinerary in localStorage
    // console.log('Setting localStorage:', { dataBooking, dataItinerary }); // Log here
    // localStorage.setItem('bookingDetails', JSON.stringify({ dataBooking, dataItinerary }));
    router.push('/profile/cancellation');
  };

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  if (!dataBooking || !dataItinerary) {
    return <div>No booking details available.</div>;
  }



  return (
    <GlassPanel className='!p-4 !rounded-[22px]  hover:cursor-pointer flex flex-col gap-2 mt-4 bg-gradient-to-br from-[#6B6B6B]/30 to-[black]'>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button variant='primary' size='sm' className='!bg-[#215CBA] text-white flex items-center gap-1'>
            {dataBooking?.status === "upcoming" ? <CiCalendar className='text-white size-5' /> :
              dataBooking?.status === "ongoing" ? <Image src="/svg-icons/ongoing-icon.svg" alt="clock" width={16} height={16} /> :
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 5V3m-9 2V3M3.25 8h17.5M3 10.044c0-2.115 0-3.173.436-3.981a3.9 3.9 0 0 1 1.748-1.651C6.04 4 7.16 4 9.4 4h5.2c2.24 0 3.36 0 4.216.412c.753.362 1.364.94 1.748 1.65c.436.81.436 1.868.436 3.983v4.912c0 2.115 0 3.173-.436 3.981a3.9 3.9 0 0 1-1.748 1.651C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.412a3.9 3.9 0 0 1-1.748-1.65C3 18.128 3 17.07 3 14.955z"/></svg>
              }
            {dataBooking?.status === "upcoming" ? "in 98 days" : dataBooking?.status?.charAt(0).toUpperCase() + dataBooking?.status?.slice(1)}
          </Button>
          <p className='text-2xl font-bold text-white'>{dataItinerary?.trip_name || 'Adventure Trip'}</p>
        </div>
        {/* <p className='text-sm text-primary-gray'>Booked  <span className='text-white'> {moment(dataItinerary?.created_at).format("DD MMM YYYY")}</span> </p> */}
      </div>
      <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>

      <div className='flex justify-between relative gap-4 h-full w-full'>
        <div className='w-full'>
          <div className='flex justify-between items-center text-white'>
            {!bookingConfirmedModal && <p className='text-2xl font-bold'>${dataItinerary?.person_cost || '--'}</p>}
          </div>
          <div className='flex items-center gap-3 my-3 text-white'>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='flex items-center gap-1 text-xs text-primary-gray'>
                <CiCalendar className='h-[17px] w-[17px] text-white' /> Dates
              </p>
              <p className='text-white text-sm ml-5'>
                {dataItinerary?.length_days ? `${dataItinerary.length_days} ${dataItinerary.length_days === 1 ? 'day' : 'days'}` : '- days'}
              </p>
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='flex items-center gap-1 text-xs text-primary-gray'>
                <LuUsers className='h-[17px] w-[17px] text-white' /> Guests
              </p>
              <p className='text-white text-sm ml-5'>
                {dataItinerary?.min_group || '1'} - {dataItinerary?.max_group || '4'}
              </p>
            </div>
            <div className='flex-1' />
          </div>

          <div className='flex items-center gap-3 mt-2 text-white'>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='flex items-center gap-1 text-xs text-primary-gray'>
                <FaPersonWalking className='h-[17px] w-[17px] text-white' /> Activities
              </p>
              <p className='text-white text-sm ml-5'>
                {dataItinerary?.activities?.length || '-'} Total
              </p>
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='flex items-center gap-1 text-xs text-primary-gray'>
                <GoHome className='h-[17px] w-[17px] text-white' /> Lodging
              </p>
              <p className='text-white text-sm ml-5'>
                {dataItinerary ? '4 nights' : '- nights'}
              </p>
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='flex items-center gap-1 text-xs text-primary-gray'>
                <MdOutlineDirectionsCarFilled className='h-[17px] w-[17px] text-white' /> Transportation
              </p>
              <p className='text-white text-sm ml-5'>
                {dataItinerary ? '3/6 days' : '- days'}
              </p>
            </div>
          </div>

        </div>

        {!bookingConfirmedModal && !bookingDetailsPage && <Image src={(dataItinerary?.images && dataItinerary.images.length > 0) ? dataItinerary.images[0] : "/images/default-itinerary.jpeg"} alt="Vacation Picture" height={200} width={204} className='rounded-lg object-cover max-md:hidden' />}

      </div>

      {/* Insurance section */}
      {dataItinerary && dataItinerary.delay_insurance ? (
        bookingConfirmedModal ? (
          <div className='mt-2'></div>
        ) : (
          <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
        )
      ) : (
        <div className='flex justify-between items-center bg-black border border-border-primary rounded-xl p-3 my-1'>
          <div>
            <p className='flex items-center gap-2 text-white'>
              <Image src="/svg-icons/insurance-shield2.svg" alt="points" width={20} height={20} />
              Delay Insurance
            </p>
            <p className='text-xs text-primary-gray ml-7 flex gap-2 mt-2'>
              <span className='rounded-full bg-[#1A1A1A] px-2 py-1'>Up to 100% reimbursement</span>
              <span className='rounded-full bg-[#1A1A1A] px-2 py-1'>Free Cancellation</span>
            </p>
          </div>
          <div className='flex gap-6'>
            <div className="flex flex-col gap-3">
              <p className='text-white items-center gap-1 flex'>
                $59 <span className='text-xs text-primary-gray'>per person</span>
              </p>
              <p className="text-[#BBD4FB] text-sm flex items-center gap-1 border-b border-b-[#BBD4FB]">
                Learn more <CgArrowTopRight className="text-white h-5 w-5" />
              </p>
            </div>
            <Button variant='primary' className='!py-3'>
              Add <span className='text-2xl ml-4'>+</span>
            </Button>
          </div>
        </div>
      )}



      <div className='flex justify-between items-center flex-wrap gap-2'>
        <div>
          <p className='flex items-center gap-2 text-white'> <Image src="/svg-icons/booking-points.svg" alt="points" width={20} height={20} />  +220 Points
            ($22)</p>
          <p className='text-sm text-primary-gray ml-7'>You’ll earn the points once you complete the trip.</p>
        </div>
        <div className='flex max-md:w-full gap-2'>
          {dataBooking?.status !== "completed" && <Button onClick={handleCancelClick} variant={bookingDetailsPage ? "simple" : "primary"} className={`  ${bookingDetailsPage ? "!bg-transparent text-[#C10B2F] " : "!bg-[#C10B2F]"}  text-white w-full`}> <span className={`${bookingDetailsPage ? "border-b border-b-[#C10B2F] whitespace-nowrap " : "text-white whitespace-nowrap"}`}> Cancel Trip</span></Button>}
          {!bookingDetailsPage && <Button onClick={handleDetailsClick} variant='outline' className=' text-white gap-2 w-full'> View {dataBooking?.status === "completed" && !bookingConfirmedModal ? "Details" : ""} <CgArrowTopRight className='size-6' /></Button>}

        </div>
      </div>


    </GlassPanel>

  );
}

export default BookingCard;
