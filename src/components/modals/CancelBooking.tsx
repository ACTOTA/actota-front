"use client";

import Button from '../figma/Button'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/src/lib/session';
import toast from 'react-hot-toast';
import actotaApi from '@/src/lib/apiClient';
import { BookingType } from '../models/Itinerary';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import { ItineraryData } from '@/src/types/itineraries';

interface CancelBookingProps {
  onClose: () => void;
  booking?: BookingType;
  totalAmount?: number;
}

const CancelBooking = ({ onClose, booking, totalAmount }: CancelBookingProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingType | null>(booking || null);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [amount, setAmount] = useState<number>(totalAmount || 0);

  // Load booking data from localStorage if not passed as prop
  useEffect(() => {
    if (!booking) {
      const storedData = localStorage.getItem('bookingDetails');
      if (storedData) {
        const { dataBooking, dataItinerary, totalAmount: storedAmount } = JSON.parse(storedData);
        setBookingData(dataBooking);
        setItineraryData(dataItinerary);
        // Calculate amount from booking data if available
        setAmount(storedAmount || dataBooking?.total_cost || dataItinerary?.total_cost || 0);
      }
    }
  }, [booking]);

  // Calculate refund amount (95% of total)
  const refundAmount = amount * 0.95;
  const cancellationFee = amount * 0.05;
  const handleCancelBooking = async () => {
    if (!bookingData || !bookingData._id) {
      toast.error('Booking information not found');
      return;
    }

    setIsLoading(true);

    try {
      // Get user info and auth token
      const session = getClientSession();
      const userId = session?.user?.user_id || JSON.parse(localStorage.getItem('user') || '{}').user_id;
      
      if (!userId) {
        toast.error('Please sign in to cancel this booking');
        return;
      }

      // Extract booking ID
      const bookingId = typeof bookingData._id === 'object' && (bookingData._id as { "$oid": string }).$oid 
        ? (bookingData._id as { "$oid": string }).$oid 
        : bookingData._id.toString();

      // Call the cancellation API
      const response = await actotaApi.post(`/api/account/${userId}/bookings/${bookingId}/cancel`);

      if (response.data.success) {
        // Show success message with refund info
        if (response.data.refund) {
          const refundAmount = response.data.refund.amount / 100; // Convert from cents
          toast.success(`Booking cancelled successfully. Refund of $${refundAmount.toFixed(2)} will be processed within 5-10 business days.`);
        } else {
          toast.success('Booking cancelled successfully (no payment to refund)');
        }

        // Clear stored booking data
        localStorage.removeItem('bookingDetails');

        // Close modal and redirect
        onClose();
        
        // Refresh the bookings list or redirect to bookings page
        router.push('/profile/bookings');
      } else {
        toast.error(response.data.error || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Cancellation error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.error?.includes('already cancelled')) {
        toast.error('This booking has already been cancelled');
      } else if (error.response?.status === 404) {
        toast.error('Booking not found');
      } else if (error.response?.status === 401) {
        toast.error('Please sign in to cancel this booking');
      } else {
        toast.error('Cancellation failed. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8'>
      <div className='flex flex-col items-center text-center mb-6'>
        <div className='flex justify-center items-center bg-gradient-to-br from-[#D02B2B] to-[#6A0101] rounded-full h-[48px] w-[48px] sm:h-[64px] sm:w-[64px] mb-4'>
          <XCircleIcon className='text-white size-6 sm:size-8' />
        </div>
        
        <h2 className='text-white text-xl sm:text-2xl font-bold mb-2'>Cancel This Booking?</h2>
        <p className='text-white text-sm sm:text-base mb-2 px-4'>
          Are you sure you want to cancel this booking? You will receive a <b>95% refund</b> (5% cancellation fee).
        </p>
        
        <p className="text-gray-400 text-xs sm:text-sm px-4">
          By canceling, you agree to our{' '}
          <a 
            href="/profile/cancellation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
            onClick={(e) => e.stopPropagation()}
          >
            cancellation policy
          </a>
          . Refunds typically process within 5-10 business days.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Booking Details Card */}
        <div className='bg-[#141414] rounded-2xl border border-primary-gray p-6'>
          <p className='text-white font-bold mb-4'>Booking Details</p>
          {bookingData && itineraryData && (
            <>
              <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6'>
                <div className='flex-1'>
                  <h3 className='text-lg sm:text-xl font-bold text-white'>{itineraryData.trip_name || 'Adventure Trip'}</h3>
                  <p className='text-xs sm:text-sm text-primary-gray mt-1'>
                    ID: {typeof bookingData._id === 'object' ? (bookingData._id as any).$oid?.slice(-8) : String(bookingData._id).slice(-8)}
                  </p>
                </div>
                <div className='text-left sm:text-right'>
                  <p className='text-xl sm:text-2xl font-bold text-white'>${itineraryData.person_cost || amount}</p>
                  <p className='text-xs sm:text-sm text-primary-gray'>per person</p>
                </div>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-primary-gray mb-1'>Travel Dates</p>
                  <p className='text-white text-sm'>
                    {bookingData.start_date && bookingData.end_date ? 
                      `${new Date(bookingData.start_date).toLocaleDateString()} - ${new Date(bookingData.end_date).toLocaleDateString()}` : 
                      bookingData.arrival_datetime && bookingData.departure_datetime ?
                      `${new Date(bookingData.arrival_datetime).toLocaleDateString()} - ${new Date(bookingData.departure_datetime).toLocaleDateString()}` :
                      `${itineraryData.length_days || '-'} days`}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-primary-gray mb-1'>Guests</p>
                  <p className='text-white text-sm'>{itineraryData.min_group || 1} - {itineraryData.max_group || 6}</p>
                </div>
                <div>
                  <p className='text-xs text-primary-gray mb-1'>Location</p>
                  <p className='text-white text-sm'>
                    {itineraryData.start_location?.city || 'Various Locations'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-primary-gray mb-1'>Status</p>
                  <p className='text-white text-sm capitalize'>{bookingData.status || 'Confirmed'}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Refund Details Card */}
        <div className='bg-[#141414] rounded-2xl border border-primary-gray p-6'>
          <p className='text-white font-bold mb-4'>Refund Details</p>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <p className='text-sm text-primary-gray'>Original Amount</p>
              <p className='text-sm text-white'>${amount.toFixed(2)}</p>
            </div>
            
            <div className='flex justify-between'>
              <p className='text-sm text-primary-gray'>Cancellation Fee (5%)</p>
              <p className='text-sm text-red-400'>-${cancellationFee.toFixed(2)}</p>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
            
            <div className='flex justify-between'>
              <p className='text-white font-bold text-lg'>Refund Amount</p>
              <p className='text-green-400 font-bold text-lg'>${refundAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='grid grid-cols-2 gap-3 max-w-md mx-auto'>
        <Button 
          size='md' 
          variant='outline' 
          className='!bg-black text-sm font-bold !py-3'
          onClick={onClose}
          disabled={isLoading}
        >
          Keep Booking
        </Button>
        
        <Button 
          size='md' 
          variant='primary' 
          className='!bg-red-600 hover:!bg-red-700 text-sm font-bold !py-3'
          onClick={handleCancelBooking}
          disabled={isLoading}
        >
          {isLoading ? 'Cancelling...' : 'Cancel Booking'}
        </Button>
      </div>
    </div>
  );
};

export default CancelBooking;