'use client';

import React from 'react'
import GlassPanel from '@/src/components/figma/GlassPanel';
import ClientOnly from "@/src/components/ClientOnly";

const Cancellation = () => {
  return (
    <GlassPanel>
      <div className='flex flex-col gap-2'>
          <h3 className='text-white font-semibold text-lg'>Cancellation Policy</h3>
          <p className='text-primary-gray'>You can cancel your trip up to 24 hours before the start of the trip. If you cancel within 24 hours, you will be charged a cancellation fee.</p>
      </div>
      <div className='flex flex-col gap-2'>
          <h3 className='text-white font-semibold text-lg'>Refund Policy</h3>
          <p className='text-primary-gray'>If you cancel your trip, you will receive a 95% refund (5% cancellation fee). Refunds are typically processed within 5-10 business days.</p>
          <p className='text-primary-gray mt-2'>Cancellations can be made directly from your bookings page by clicking the &ldquo;Cancel Trip&rdquo; button on any confirmed or ongoing booking.</p>
      </div>
    </GlassPanel>
  )
}

export default function CancellationPage() {
  return (
    <ClientOnly>
      <Cancellation />
    </ClientOnly>
  );
}