'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Button from '../figma/Button';
import Modal from '../Modal';
import { useModal } from '../../context/ModalContext';

interface PaymentPartialProps {
  message?: string;
}

const PaymentPartial: React.FC<PaymentPartialProps> = ({ message: propMessage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hideModal } = useModal();
  const message = propMessage || searchParams.get('message') || 'Your booking was created, but payment status is pending';

  return (
    <Modal onClose={hideModal} isLoading={false}>
      <div className="bg-black w-[556px] max-sm:w-[95vw] rounded-2xl border border-border-primary px-8 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <ExclamationTriangleIcon className="h-20 w-20 text-yellow-500" />
          <h2 className="text-2xl font-bold text-center text-white">Payment Processing</h2>
          <p className="text-primary-gray text-center">{message}</p>
          <p className="text-primary-gray text-center text-sm">Your booking has been created, but we're still processing your payment. Please contact customer support if you have any concerns.</p>
          
          <div className="flex gap-4 w-full mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/profile/bookings')}
            >
              View Bookings
            </Button>
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
    </Modal>
  );
};

export default PaymentPartial;
