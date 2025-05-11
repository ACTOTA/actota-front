'use client'

import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
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

  // Force cancel processing if it takes too long
  const handleCancel = () => {
    // Go to home page directly using window.location for more reliable navigation
    window.location.href = '/';
  };

  return (
    <Modal onClose={hideModal} isLoading={true}>
      <div className="bg-black w-[556px] max-sm:w-[95vw] rounded-2xl border border-border-primary px-8 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader />
          <h2 className="text-2xl font-bold text-center text-white">Processing Your Payment</h2>
          <p className="text-primary-gray text-center">
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
    </Modal>
  );
};

export default ProcessingPayment;
