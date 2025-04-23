"use client"; // Required if using client-side features

import Image from "next/image";
import Button from '../figma/Button'
import Trash from '@/public/svg-icons/trash.svg'

interface CancelBookingProps {
  onClose: () => void;
}

const CancelBooking = ({ onClose }: CancelBookingProps) => {
  return (
    <div className="relative bg-gray-800 p-6 rounded-2xl w-full max-w-md mx-4">
      {/* Background image */}
      <Image
        src="/images/delete-payment-card-blur.png"
        className="absolute z-[-1] top-0 left-0 w-full h-full rounded-2xl object-cover"
        fill // Makes image cover the container
        alt="delete-payment-card-blur"
        priority // Optional: prioritize loading
      />
      {/* Modal content */}
      <div className="relative z-10 flex flex-col items-center">
        <Trash className="w-8 h-8 text-white" />
        <p className="text-white text-xl font-bold mt-3">Cancel This Trip?</p>
        <p className="text-white text-sm text-center mt-2">
          Are you sure you want to cancel this booking information from your
          account?
        </p>
        <div className="flex gap-2 mt-4 w-full">
          <Button
            className="flex-1 bg-black text-white border border-white"
            variant="outline"
            onClick={onClose} // Close modal
          >
            No
          </Button>
          <Button
            className="flex-1 bg-[#C10B2F] text-white"
            variant="primary"
            onClick={() => {
              // Add cancellation logic here (e.g., API call)

              console.log("Trip cancelled");
              onClose(); // Close modal after confirming
            }}
          >
            Yes, Cancel Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking;

// import Trash from '@/public/svg-icons/trash.svg'
// import React from 'react'
// import Button from '../figma/Button'
// import Image from 'next/image'

// const CancelBooking = () => {

//     return (
//         // Full-screen overlay for the modal
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           {/* Modal content container */}
//           <div className="relative bg-gray-800 p-6 rounded-2xl w-full max-w-md mx-4">
//             {/* Background image */}
//             <Image
//               src="/images/delete-payment-card-blur.png"
//               className="absolute z-[-1] top-0 left-0 w-full h-full rounded-2xl object-cover"
//               fill // Use `fill` to make the image cover the container
//               alt="delete-payment-card-blur"
//               priority // Optional: prioritize loading for modals
//             />
//             {/* Modal content */}
//             <div className="relative z-10 flex flex-col items-center">
//               <Trash className="w-8 h-8 text-white" /> {/* Adjust icon size */}
//               <p className="text-white text-xl font-bold mt-3">Cancel This Trip?</p>
//               <p className="text-white text-sm text-center mt-2">
//                 Are you sure you want to cancel this booking information from your
//                 account?
//               </p>
//               <div className="flex gap-2 mt-4 w-full">
//                 <Button
//                   className="flex-1 bg-black text-white border border-white"
//                   variant="outline"
//                 >
//                   Cancel
//                 </Button>
//                 <Button className="flex-1 bg-[#C10B2F] text-white" variant="primary">
//                   Yes, Cancel
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       );

// }

// export default CancelBooking