'use client'

import { XCircleIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Button from '../figma/Button';
import ModalContainer from '../ModalContainer';

const BookingFailure: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Unable to create your booking at this time';

  // Determine if this is a technical error message
  const isTechnicalError = message.includes('404') ||
                           message.includes('endpoint') ||
                           message.includes('API');

  return (
    <ModalContainer>
      <div className="bg-black w-[556px] max-sm:w-[95vw] rounded-2xl border border-border-primary px-8 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <XCircleIcon className="h-20 w-20 text-red-500" />
          <h2 className="text-2xl font-bold text-center text-white">Booking Failed</h2>
          <p className="text-primary-gray text-center">{message}</p>

          {isTechnicalError ? (
            <div className="bg-gray-900 p-4 rounded-lg w-full text-sm">
              <p className="text-primary-gray mb-2">Technical Error Details:</p>
              <p className="text-primary-gray">It appears there might be a technical issue with the booking system. Please try again later or contact customer support.</p>
            </div>
          ) : (
            <p className="text-primary-gray text-center text-sm">Your payment has been authorized but not captured. You will not be charged.</p>
          )}

          <div className="flex gap-4 w-full mt-4">
            {!isTechnicalError ? (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Try Again
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/')}
              >
                Return Home
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => router.push('/itineraries')}
            >
              Browse Itineraries
            </Button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default BookingFailure;