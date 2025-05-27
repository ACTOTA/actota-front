'use client'

import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import { useRouter } from 'next/navigation';
import Button from '../figma/Button';
import { useModal } from '../../context/ModalContext';

const ProcessingPayment: React.FC = () => {
  const router = useRouter();
  const { hideModal } = useModal();
  const [processingTime, setProcessingTime] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);

  // Add a timeout to detect potential hanging processing
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 10 && !isTimeout) {
          setIsTimeout(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeout]);

  // Failsafe: Check if we should redirect to success
  useEffect(() => {
    const checkForSuccess = () => {
      // Check if there's a recent successful booking in localStorage
      const lastBookingAttempt = localStorage.getItem('lastBookingAttempt');
      const recentBookingSuccess = localStorage.getItem('recentBookingSuccess');
      
      if (recentBookingSuccess) {
        const successData = JSON.parse(recentBookingSuccess);
        const successTime = new Date(successData.timestamp);
        const now = new Date();
        
        // If the success was within the last minute, redirect
        if (now.getTime() - successTime.getTime() < 60000) {
          console.log('Found recent booking success, redirecting...');
          localStorage.removeItem('recentBookingSuccess');
          router.push('?modal=bookingConfirmed');
          return;
        }
      }
    };

    // Check immediately and then every 2 seconds
    checkForSuccess();
    const successCheck = setInterval(checkForSuccess, 2000);

    return () => clearInterval(successCheck);
  }, [router]);

  // Force cancel processing if it takes too long
  const handleCancel = () => {
    // Go to home page directly using window.location for more reliable navigation
    window.location.href = '/';
  };

  return (
    <div className="w-full max-w-[556px]">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader />
          <h2 className="text-2xl font-bold text-white">Processing Your Payment</h2>
          <p className="text-primary-gray">
            Please wait while we process your booking and payment. This may take a few moments.
          </p>

          {isTimeout && (
            <div className="mt-4 w-full">
              <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-yellow-500 font-medium mb-2">This is taking longer than expected</p>
                <p className="text-primary-gray text-sm">
                  There might be an issue with our payment processing system. You can wait a bit longer or cancel the process.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel and Return Home
              </Button>
            </div>
          )}
        </div>
    </div>
  );
};

export default ProcessingPayment;
