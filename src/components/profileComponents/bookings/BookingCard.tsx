'use client'
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect } from 'react';
import Button from '@/src/components/figma/Button';
import Image from 'next/image';
import { FaCheck, FaPersonWalking } from 'react-icons/fa6';
import { GoHome } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { CgArrowTopRight } from "react-icons/cg";
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineDirectionsCarFilled } from 'react-icons/md';
import moment from 'moment';
import { BookingType } from '../../models/Itinerary';
import { ItineraryData } from '@/src/types/itineraries';
import BaseCard from '../../shared/BaseCard';
import StatusBadge from '../../shared/StatusBadge';
import InfoGrid from '../../shared/InfoGrid';

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

  // Log the dataBooking object to see available fields
  useEffect(() => {
    if (dataBooking) {
      console.log('BookingCard - dataBooking object:', dataBooking);
      console.log('BookingCard - dataBooking fields:', Object.keys(dataBooking));
      
      // Log specifically date-related fields
      console.log('BookingCard - Date fields:', {
        start_date: dataBooking.start_date,
        end_date: dataBooking.end_date,
        created_at: dataBooking.created_at,
        arrival_datetime: dataBooking.arrival_datetime,
        departure_datetime: dataBooking.departure_datetime,
        booking_date: (dataBooking as any).booking_date,
        travel_dates: (dataBooking as any).travel_dates,
      });
    }
  }, [dataBooking]);

  // Helper function to get start and end dates from booking data
  const getBookingDates = () => {
    if (!dataBooking) return { startDate: null, endDate: null };
    
    // Try start_date/end_date first, then arrival_datetime/departure_datetime
    const startDate = dataBooking.start_date || dataBooking.arrival_datetime;
    const endDate = dataBooking.end_date || dataBooking.departure_datetime;
    
    return { startDate, endDate };
  };

  const handleDetailsClick = () => {
    if (!dataBooking || !dataBooking._id) {
      console.error('No booking ID available');
      return;
    }
    
    // Extract booking ID
    const bookingId = typeof dataBooking._id === 'object' && (dataBooking._id as { "$oid": string }).$oid 
      ? (dataBooking._id as { "$oid": string }).$oid 
      : dataBooking._id.toString();
      
    // Navigate to the booking details page with the ID
    router.push(`/bookings/${bookingId}`);
  };

  const handleCancelClick = () => {
    // Store booking and itinerary data for the modal
    if (dataBooking && dataItinerary) {
      localStorage.setItem('bookingDetails', JSON.stringify({ 
        dataBooking, 
        dataItinerary,
        totalAmount: dataBooking.total_cost || dataItinerary.total_cost || 0
      }));
    }
    // Open the cancel booking modal
    router.push("?modal=cancelBooking");
  };

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  if (!dataBooking) {
    return <div className="text-white p-4">Loading booking details...</div>;
  }
  
  // If itinerary data is still loading, show a partial card with loading state
  const isItineraryLoading = !dataItinerary;

  return (
    <BaseCard className="mt-4">
      
      {/* Header with status and price */}
      <div className='flex flex-row items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-3'>
          <StatusBadge 
            status={dataBooking?.status || 'confirmed'}
            label={(() => {
              if (dataBooking?.status === "upcoming") {
                const { startDate } = getBookingDates();
                if (startDate) {
                  const daysUntil = Math.ceil((new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return `in ${Math.max(1, daysUntil)} days`;
                }
              }
              return dataBooking?.status?.charAt(0).toUpperCase() + dataBooking?.status?.slice(1) || 'Confirmed';
            })()}
          />
        </div>
        {!bookingConfirmedModal && (
          <div className='text-right'>
            <p className='text-2xl font-bold text-white'>${dataItinerary?.person_cost || '--'}</p>
            <p className='text-xs text-gray-400'>per person</p>
          </div>
        )}
      </div>

      {/* Mobile image */}
      {!bookingConfirmedModal && !bookingDetailsPage && (
        <div className='sm:hidden mb-4'>
          <Image 
            src={isItineraryLoading ? "/images/default-itinerary.jpeg" : ((dataItinerary?.images && dataItinerary.images.length > 0) ? dataItinerary.images[0] : "/images/default-itinerary.jpeg")}
            alt="Trip image" 
            height={200} 
            width={400} 
            className='rounded-xl object-cover w-full' 
          />
        </div>
      )}

      {/* Trip name and image */}
      <div className='flex gap-6 mb-6'>
        <div className='flex-1'>
          <h3 className='text-lg sm:text-xl font-bold text-white mb-4'>{dataItinerary?.trip_name || 'Adventure Trip'}</h3>
          
          {/* Trip details grid */}
          <InfoGrid 
            items={[
              {
                icon: <CiCalendar className='size-4' />,
                label: 'Dates',
                value: (() => {
                  const { startDate, endDate } = getBookingDates();
                  if (startDate && endDate) {
                    return `${moment(startDate).format('MMM D')} - ${moment(endDate).format('MMM D, YYYY')}`;
                  }
                  return dataItinerary?.length_days ? 
                    `${dataItinerary.length_days} ${dataItinerary.length_days === 1 ? 'day' : 'days'}` : 
                    '- days';
                })()
              },
              {
                icon: <LuUsers className='size-4' />,
                label: 'Guests',
                value: `${dataItinerary?.min_group || '1'} - ${dataItinerary?.max_group || '4'}`
              },
              {
                icon: <FaPersonWalking className='size-4' />,
                label: 'Activities',
                value: `${dataItinerary?.activities?.length || '-'} Total`
              },
              {
                icon: <GoHome className='size-4' />,
                label: 'Lodging',
                value: isItineraryLoading ? '- nights' : 
                  (dataItinerary?.lodging && dataItinerary.lodging.length > 0 ?
                    `${dataItinerary.lodging.length} ${dataItinerary.lodging.length === 1 ? 'night' : 'nights'}` :
                    '0 nights')
              }
            ]}
            columns={2}
          />
        </div>

        {!bookingConfirmedModal && !bookingDetailsPage && (
          <div className='flex-shrink-0 hidden sm:block'>
            <Image 
              src={isItineraryLoading ? "/images/default-itinerary.jpeg" : ((dataItinerary?.images && dataItinerary.images.length > 0) ? dataItinerary.images[0] : "/images/default-itinerary.jpeg")}
              alt="Trip image" 
              height={120} 
              width={160} 
              className='rounded-xl object-cover' 
            />
          </div>
        )}
      </div>

      {/* Insurance section */}
      {!(dataItinerary && dataItinerary.delay_insurance) && (
        <div className='bg-[#0F0F0F] border border-[#222] rounded-xl p-4 mb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex-1'>
              <p className='flex items-center gap-2 text-white font-medium mb-2'>
                <Image src="/svg-icons/insurance-shield2.svg" alt="insurance" width={20} height={20} />
                Delay Insurance
              </p>
              <div className='flex flex-wrap gap-2 sm:ml-6'>
                <span className='text-xs bg-[#222] text-gray-300 px-3 py-1 rounded-full'>Up to 100% reimbursement</span>
                <span className='text-xs bg-[#222] text-gray-300 px-3 py-1 rounded-full'>Free Cancellation</span>
              </div>
            </div>
            <div className='flex items-center justify-between sm:justify-center gap-4 mt-2 sm:mt-0'>
              <div className="text-center">
                <p className='text-white font-bold'>$59</p>
                <p className='text-xs text-gray-400'>per person</p>
              </div>
              <Button variant='primary' size='sm' className='!bg-blue-600 hover:!bg-blue-700'>
                Add +
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Points and actions */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#333]'>
        <div className='flex items-center gap-2'>
          <Image src="/svg-icons/booking-points.svg" alt="points" width={20} height={20} />
          <div>
            <p className='text-white font-medium text-sm'>+220 Points ($22)</p>
            <p className='text-xs text-gray-400'>Earned once you complete the trip</p>
          </div>
        </div>
        
        <div className='flex gap-3 w-full sm:w-auto'>
          {(dataBooking?.status === "confirmed" || dataBooking?.status === "ongoing" || dataBooking?.status === "upcoming") && 
            <Button 
              onClick={handleCancelClick} 
              variant={bookingDetailsPage ? "simple" : "outline"} 
              size='sm'
              className={`flex-1 sm:flex-none ${bookingDetailsPage ? 
                "!bg-transparent !text-red-400 !border-red-400/50 hover:!bg-red-400/10" : 
                "!border-red-500 !text-red-400 hover:!bg-red-500/10"
              }`}
            > 
              Cancel Trip
            </Button>
          }
          {!bookingDetailsPage && (
            <Button 
              onClick={handleDetailsClick} 
              variant='primary' 
              size='sm'
              className='flex-1 sm:flex-none !bg-white !text-black hover:!bg-gray-200 flex items-center justify-center gap-2'
            > 
              View Details <CgArrowTopRight className='size-4' />
            </Button>
          )}
        </div>
      </div>

    </BaseCard>

  );
}

export default BookingCard;