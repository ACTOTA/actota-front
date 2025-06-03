"use client";

import Button from '../figma/Button'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/src/lib/session';
import toast from 'react-hot-toast';
import actotaApi from '@/src/lib/apiClient';
import { BookingType } from '../models/Itinerary';
import { XCircleIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { ItineraryData } from '@/src/types/itineraries';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import BaseCard from '../shared/BaseCard';

interface CancelBookingProps {
  onClose: () => void;
  booking?: BookingType;
  totalAmount?: number;
}

const CancelBooking = ({ onClose, booking, totalAmount }: CancelBookingProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  // Helper function to parse MongoDB Extended JSON dates
  const parseMongoDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    
    try {
      if (dateValue instanceof Date) return dateValue;
      
      if (dateValue.$date) {
        if (dateValue.$date.$numberLong) {
          const timestamp = parseInt(dateValue.$date.$numberLong);
          // TEMPORARY: Add 24 years to test dates from 2001
          const date = new Date(timestamp);
          if (date.getFullYear() < 2020) {
            date.setFullYear(date.getFullYear() + 24);
          }
          return date;
        }
        if (typeof dateValue.$date === 'number') {
          return new Date(dateValue.$date);
        }
        if (typeof dateValue.$date === 'string') {
          return new Date(dateValue.$date);
        }
      }
      
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        return new Date(dateValue);
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    
    return null;
  };

  // Get formatted dates
  const getFormattedDates = () => {
    const startDate = parseMongoDate(bookingData?.start_date) || 
                     parseMongoDate(bookingData?.arrival_datetime);
    const endDate = parseMongoDate(bookingData?.end_date) || 
                   parseMongoDate(bookingData?.departure_datetime);
    
    if (startDate && endDate) {
      return `${moment(startDate).format('MMM D')} - ${moment(endDate).format('MMM D, YYYY')}`;
    }
    return 'Date not available';
  };

  // Calculate refund amount (95% of total)
  const calculatedAmount = bookingData?.total_cost || itineraryData?.person_cost || amount || 0;
  const refundAmount = calculatedAmount * 0.95;
  const cancellationFee = calculatedAmount * 0.05;
  const handleCancelBooking = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
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

        // Invalidate the bookings query to refresh the list
        await queryClient.invalidateQueries({ queryKey: ['bookings'] });
        
        // Also invalidate the specific booking query if it exists
        if (bookingId) {
          await queryClient.invalidateQueries({ queryKey: ['bookingsById', bookingId] });
        }

        // Close modal
        onClose();
        
        // Stay on the same page - the list will refresh automatically
        if (window.location.pathname !== '/profile/bookings') {
          router.push('/profile/bookings');
        }
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
    <div className='w-full max-w-[900px] mx-auto px-4 pb-4'>
      {!showConfirmation ? (
        <>
          {/* Initial Cancellation Screen */}
          <div className='flex flex-col items-center text-center mb-8'>
            <div className='flex justify-center items-center bg-red-500/10 rounded-full h-16 w-16 mb-4'>
              <ExclamationTriangleIcon className='text-red-500 size-8' />
            </div>
            
            <h2 className='text-white text-2xl font-bold mb-3'>Cancel Your Booking?</h2>
            <p className='text-gray-400 text-base max-w-lg'>
              We're sorry to see you go. Please review your booking details and cancellation terms below.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
            {/* Booking Details Card */}
            <BaseCard className="p-6">
              <h3 className='text-white font-semibold mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
                Booking Information
              </h3>
              {bookingData && itineraryData && (
                <>
                  <div className='mb-6'>
                    <h4 className='text-lg font-bold text-white'>{itineraryData.trip_name || 'Adventure Trip'}</h4>
                    <p className='text-sm text-gray-400 mt-1'>
                      Booking ID: {typeof bookingData._id === 'object' ? (bookingData._id as any).$oid?.slice(-8) : String(bookingData._id).slice(-8)}
                    </p>
                  </div>
                  
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center py-2 border-b border-gray-800'>
                      <span className='text-sm text-gray-400'>Travel Dates</span>
                      <span className='text-sm text-white font-medium'>{getFormattedDates()}</span>
                    </div>
                    <div className='flex justify-between items-center py-2 border-b border-gray-800'>
                      <span className='text-sm text-gray-400'>Duration</span>
                      <span className='text-sm text-white font-medium'>
                        {itineraryData.length_days} {itineraryData.length_days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-2 border-b border-gray-800'>
                      <span className='text-sm text-gray-400'>Guests</span>
                      <span className='text-sm text-white font-medium'>
                        {itineraryData.min_group || 1} - {itineraryData.max_group || 6} people
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-2 border-b border-gray-800'>
                      <span className='text-sm text-gray-400'>Location</span>
                      <span className='text-sm text-white font-medium'>
                        {itineraryData.start_location?.city || 'Various Locations'}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-sm text-gray-400'>Booking Status</span>
                      <span className='text-sm text-green-400 font-medium capitalize'>
                        {bookingData.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </BaseCard>

            {/* Refund Details Card */}
            <BaseCard className="p-6">
              <h3 className='text-white font-semibold mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                Cancellation Terms
              </h3>
              
              <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4'>
                <p className='text-sm text-red-400 flex items-start gap-2'>
                  <ExclamationTriangleIcon className='w-5 h-5 flex-shrink-0 mt-0.5' />
                  A 5% cancellation fee applies to all bookings
                </p>
              </div>
              
              <div className='space-y-3'>
                <div className='flex justify-between items-center py-3 border-b border-gray-800'>
                  <span className='text-sm text-gray-400'>Original Booking Amount</span>
                  <span className='text-sm text-white font-medium'>${calculatedAmount.toFixed(2)}</span>
                </div>
                
                <div className='flex justify-between items-center py-3 border-b border-gray-800'>
                  <span className='text-sm text-gray-400'>Cancellation Fee (5%)</span>
                  <span className='text-sm text-red-400 font-medium'>-${cancellationFee.toFixed(2)}</span>
                </div>
                
                <div className='flex justify-between items-center py-3 bg-green-500/10 rounded-lg px-3'>
                  <span className='text-base text-white font-semibold'>Refund Amount</span>
                  <span className='text-lg text-green-400 font-bold'>${refundAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className='mt-4 p-3 bg-gray-800/50 rounded-lg'>
                <p className='text-xs text-gray-400'>
                  <span className='font-medium'>Processing Time:</span> Refunds typically appear in your account within 5-10 business days.
                </p>
              </div>
            </BaseCard>
          </div>

          {/* Cancellation Policy Link */}
          <div className='text-center mb-6'>
            <p className='text-sm text-gray-400'>
              By proceeding, you agree to our{' '}
              <a 
                href='/profile/cancellation' 
                target='_blank' 
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300 underline'
                onClick={(e) => e.stopPropagation()}
              >
                cancellation policy
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 max-w-md mx-auto'>
            <Button 
              size='md' 
              variant='outline' 
              className='flex-1 !bg-transparent !border-gray-600 hover:!bg-gray-800 text-white font-semibold'
              onClick={onClose}
              disabled={isLoading}
            >
              Keep My Booking
            </Button>
            
            <Button 
              size='md' 
              variant='primary' 
              className='flex-1 !bg-red-600 hover:!bg-red-700 text-white font-semibold'
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              Continue to Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Confirmation Screen */}
          <div className='flex flex-col items-center text-center mb-8'>
            <div className='flex justify-center items-center bg-red-500/10 rounded-full h-16 w-16 mb-4'>
              <XCircleIcon className='text-red-500 size-8' />
            </div>
            
            <h2 className='text-white text-2xl font-bold mb-3'>Final Confirmation</h2>
            <p className='text-gray-400 text-base max-w-lg mb-2'>
              Are you absolutely sure you want to cancel this booking?
            </p>
            <p className='text-red-400 font-medium'>
              This action cannot be undone.
            </p>
          </div>

          {/* Summary Box */}
          <BaseCard className='p-6 mb-8 max-w-md mx-auto'>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-400'>Trip</span>
                <span className='text-white font-medium'>{itineraryData?.trip_name || 'Adventure Trip'}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-400'>Dates</span>
                <span className='text-white font-medium'>{getFormattedDates()}</span>
              </div>
              <div className='border-t border-gray-800 pt-3 flex justify-between items-center'>
                <span className='text-gray-400'>You will receive</span>
                <span className='text-green-400 font-bold text-lg'>${refundAmount.toFixed(2)}</span>
              </div>
            </div>
          </BaseCard>

          {/* Final Action Buttons */}
          <div className='flex gap-3 max-w-md mx-auto'>
            <Button 
              size='md' 
              variant='outline' 
              className='flex-1 !bg-transparent !border-gray-600 hover:!bg-gray-800 text-white font-semibold'
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Go Back
            </Button>
            
            <Button 
              size='md' 
              variant='primary' 
              className='flex-1 !bg-red-600 hover:!bg-red-700 text-white font-semibold'
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Cancelling...
                </span>
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CancelBooking;