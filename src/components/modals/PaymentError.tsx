'use client'

import { XCircleIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Button from '../figma/Button';

interface PaymentErrorProps {
  message?: string;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ message: propMessage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = propMessage || searchParams.get('message') || 'An error occurred during payment processing';

  const handleClose = () => {
    router.push(window.location.pathname);
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
              onClick={() => {
                handleClose();
                setTimeout(() => router.back(), 100);
              }}
            >
              Try Again
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
