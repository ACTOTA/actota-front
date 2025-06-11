'use client'

import { XCircleIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Button from '../figma/Button';

interface BookingFailureProps {
  message?: string;
}

const BookingFailure: React.FC<BookingFailureProps> = ({ message: propMessage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMessage = searchParams.get('message');
  const message = propMessage || urlMessage || 'Unable to create your booking at this time';

  // Determine if this is a technical error message
  const isTechnicalError = message.includes('404') ||
                           message.includes('endpoint') ||
                           message.includes('API');

  const handleClose = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="w-full max-w-[556px]">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <XCircleIcon className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">Booking Failed</h2>
        <p className="text-primary-gray text-sm sm:text-base">{message}</p>

        {isTechnicalError ? (
          <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg w-full text-xs sm:text-sm">
            <p className="text-primary-gray mb-1 sm:mb-2 font-semibold">Technical Error Details:</p>
            <p className="text-primary-gray">It appears there might be a technical issue with the booking system. Please try again later or contact customer support.</p>
          </div>
        ) : (
          <p className="text-primary-gray text-xs sm:text-sm">Your payment has been authorized but not captured. You will not be charged.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-2 sm:mt-4">
          {!isTechnicalError ? (
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => {
                handleClose();
                setTimeout(() => router.back(), 100);
              }}
            >
              Try Again
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => {
                handleClose();
                setTimeout(() => router.push('/'), 100);
              }}
            >
              Return Home
            </Button>
          )}
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
  );
};

export default BookingFailure;
