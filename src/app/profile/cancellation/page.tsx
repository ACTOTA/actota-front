'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import { CgArrowTopRight } from 'react-icons/cg';
import Button from '@/src/components/figma/Button';
import GlassPanel from '@/src/components/figma/GlassPanel';
import Image from 'next/image';
import ClientOnly from "@/src/components/ClientOnly";
import CancelBooking from '@/src/components/modals/CancelBooking';
import { useState } from "react";

const Cancellation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelClick = () => {
    // Store booking and itinerary in localStorage (if needed)
    // localStorage.setItem('bookingDetails', JSON.stringify({ dataBooking, dataItinerary }));
    setIsModalOpen(true); // Open the modal
  };

  // return (
  //   <div className="min-h-screen bg-gray-900">
  //     {/* Main page content */}
  //     <h1 className="text-white text-2xl p-4">Cancellation Page</h1>
  //     <button
  //       onClick={handleCancelClick}
  //       className="bg-blue-500 text-white px-4 py-2 rounded m-4"
  //     >
  //       Cancel Booking
  //     </button>

  //     {/* Modal rendering */}
  //     {isModalOpen && (
  //       <div
  //         className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  //         onClick={() => setIsModalOpen(false)} // Close on overlay click
  //       >
  //         <div
  //           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
  //         >
  //           <CancelBooking onClose={() => setIsModalOpen(false)} />
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  // const router = useRouter();
  // const handleCancelClick = () => {
  //   // Store booking and itinerary in localStorage
  //   // console.log('Setting localStorage:', { dataBooking, dataItinerary }); // Log here
  //   // localStorage.setItem('bookingDetails', JSON.stringify({ dataBooking, dataItinerary }));
  //   router.push("?modal=CancelBooking")
  // };
  

  return (
    <GlassPanel>
      <div className='flex flex-col gap-2'>
          <h3 className='text-white font-semibold text-lg'>Cancellation Policy</h3>
          <p className='text-primary-gray'>You can cancel your trip up to 24 hours before the start of the trip. If you cancel within 24 hours, you will be charged a cancellation fee.</p>
      </div>
      <div className='flex flex-col gap-2'>
          <h3 className='text-white font-semibold text-lg'>Refund Policy</h3>
          <p className='text-primary-gray'>If you cancel your trip, you will receive a full refund within 5-7 business days.</p>
          {<Button onClick={handleCancelClick}  className="!bg-transparent text-[#C10B2F] "> <span className="border-b border-b-[#C10B2F] whitespace-nowrap "> Cancel Trip</span></Button>}
          {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setIsModalOpen(false)} // Close on overlay click
              >
                <div
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
                >
                  <CancelBooking onClose={() => setIsModalOpen(false)} />
                </div>
              </div>
            )}
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