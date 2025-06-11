'use client'

import { XCircleIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Button from '../figma/Button';
import { useBookingWithPayment } from '@/src/hooks/mutations/payment.mutation';
import { getClientSession } from '@/src/lib/session';
import toast from 'react-hot-toast';

interface PaymentErrorProps {
  message?: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ message: propMessage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = propMessage || searchParams.get('message') || 'An error occurred during payment processing';
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { mutate: processBookingWithPayment, isLoading: isBookingWithPaymentLoading } = useBookingWithPayment();

  const handleClose = () => {
    router.push(window.location.pathname);
  };

  // Helper function to get user information
  const getUserInfo = () => {
    const session = getClientSession();
    let userInfo;

    if (session.isLoggedIn && session.user) {
      userInfo = session.user;
    } else {
      // Fall back to localStorage for compatibility
      userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    }

    return userInfo;
  };

  // Helper function to get trip dates
  const getTripDates = () => {
    const savedTripDates = localStorage.getItem('tripDates');
    if (savedTripDates) {
      try {
        const parsedDates = JSON.parse(savedTripDates);
        return {
          arrival_datetime: new Date(parsedDates.arrival_datetime).toISOString(),
          departure_datetime: new Date(parsedDates.departure_datetime).toISOString()
        };
      } catch (e) {
        console.error('Error parsing saved dates:', e);
      }
    }
    return null;
  };

  const handleRetryBooking = async () => {
    try {
      setIsRetrying(true);
      
      // Get booking data from localStorage (set during the original booking attempt)
      const lastBookingAttempt = localStorage.getItem('lastBookingAttempt');
      const itineraryData = localStorage.getItem('itineraryData');
      
      if (!lastBookingAttempt) {
        toast.error('No booking data found. Please start the booking process again.');
        return;
      }

      const bookingData = JSON.parse(lastBookingAttempt);
      const userInfo = getUserInfo();
      const tripDates = getTripDates();

      if (!tripDates) {
        toast.error('Trip dates not found. Please start the booking process again.');
        return;
      }

      if (!userInfo.user_id) {
        toast.error('User information not found. Please sign in again.');
        return;
      }

      // Show processing modal
      router.push("?modal=processingPayment");

      // Retry the booking with the same parameters
      processBookingWithPayment({
        itineraryId: bookingData.itineraryId,
        paymentIntentId: bookingData.paymentIntentId,
        customerId: userInfo.customer_id || bookingData.customerId,
        arrivalDatetime: tripDates.arrival_datetime,
        departureDatetime: tripDates.departure_datetime
      }, {
        onSuccess: (result) => {
          if (result.success) {
            console.log('Retry booking successful:', result);
            toast.success('Booking confirmed successfully!');
            router.push("?modal=bookingConfirmed");
          } else {
            console.error('Retry booking failed:', result.error);
            router.push(`?modal=paymentError&message=${encodeURIComponent(result.error || 'Booking failed again')}`);
          }
        },
        onError: (error: any) => {
          console.error('Error retrying booking:', error);
          
          // If the error is a 404, show a special message
          if (error.message && error.message.includes('404')) {
            router.push(`?modal=bookingFailure&message=${encodeURIComponent('The booking API endpoint is unavailable (404). Please contact support.')}`);
          } else {
            const errorMessage = error.message || 'An unknown error occurred during payment processing';
            router.push(`?modal=paymentError&message=${encodeURIComponent(errorMessage)}`);
          }
        }
      });

    } catch (error: any) {
      console.error('Error setting up retry:', error);
      toast.error('Failed to retry booking. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className='max-sm:w-[100vw] px-8'>
      <div className="w-full max-w-[556px]">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <XCircleIcon className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Payment Failed</h2>
          <p className="text-primary-gray text-sm sm:text-base">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-2 sm:mt-4">
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={handleRetryBooking}
              disabled={isRetrying || isBookingWithPaymentLoading}
            >
              {isRetrying || isBookingWithPaymentLoading ? 'Retrying...' : 'Try Again'}
            </Button>
            <Button
              variant="primary"
              className="w-full sm:flex-1"
              onClick={() => {
                handleClose();
                setTimeout(() => router.push('/itineraries'), 100);
              }}
            >
              Browse Itineraries
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
