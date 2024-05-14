import React from 'react';
import { activities } from "../Activities"; 
import { FaClock } from "react-icons/fa"; // Ensure you import FaClock correctly

const types = [
  {
    category: 'Level 1',
    subtitle: 'Lightly active',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    category: 'Activities',
    subtitle: 'Included in itinerary',
    icons: {
      hiking: activities.find(a => a.label === 'Hiking').icon,
      fishing: activities.find(a => a.label === 'Fishing').icon,
      whiteWater: activities.find(a => a.label === 'White Water').icon,
    },
  },
  {
    category: 'Duration',
    subtitle: 'Included in itinerary',
    icon: FaClock,
    duration: '6-8 Hours'
  },
  // More types...
];

export default function ListingType() {
  return (
    <div className="p-4 rounded-lg shadow-lg bg-slate-100">
      <h1 className="mb-4 text-xl font-bold text-center text-black">Itinerary Details</h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
        {types.map((type) => (
          <div
            key={type.category}
            className="relative flex items-center px-6 py-2 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-logo-blue"
          >
            <div className="flex-1 min-w-0">
              <a href="#" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{type.category}</p>
                <p className="text-sm text-gray-500 truncate">{type.subtitle}</p>
              </a>
            </div>
            <div className="flex items-center flex-shrink-0 space-x-2">
              {type.category === 'Activities' ? (
                <div className="flex space-x-2">
                  {Object.values(type.icons).map((Icon, idx) => (
                    <Icon key={idx}
                      size={40}
                      className="my-auto text-black transition-transform duration-200 ease-in-out bg-white border-2 rounded-full bg-logo-blue border-logo-yellow hover:border-logo-red hover:scale-105"
                      style={{ marginLeft: '5px' }}
                    />
                  ))}
                </div>
              ) : typeof type.icon === 'string' ? (
                <img className="w-10 h-10 transition-transform duration-200 ease-in-out rounded-full hover:border-logo-red hover:scale-105" src={type.icon} alt="" style={{ border: '2px solid', borderColor: 'inherit' }} />
              ) : (
                <FaClock size={40}
                  className="my-auto text-black transition-transform duration-200 ease-in-out bg-white border-2 rounded-full bg-logo-blue border-logo-yellow hover:border-logo-red hover:scale-105"
                  style={{ marginLeft: '5px' }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// 'use client';

// import { Range } from "react-date-range";

// import Button from "../Button";
// import Calendar from "../inputs/Calendar";

// interface ListingReservationProps {
//   price: number;
//   dateRange: Range,
//   totalPrice: number;
//   onChangeDate: (value: Range) => void;
//   onSubmit: () => void;
//   disabled?: boolean;
//   disabledDates: Date[];
// }

// const ListingReservation: React.FC<
//   ListingReservationProps
// > = ({
//   price,
//   dateRange,
//   totalPrice,
//   onChangeDate,
//   onSubmit,
//   disabled,
//   disabledDates
// }) => {
//   return ( 
//     <div 
//       className="
//       bg-white 
//         rounded-xl 
//         border-[1px]
//       border-neutral-200 
//         overflow-hidden
//       "
//     >
//       <div className="flex flex-row items-center gap-1 p-4 //">
//         <div className="text-2xl font-semibold">
//           $ {price}
//         </div>
//         <div className="font-light text-neutral-600">
//           night
//         </div>
//       </div>
//       <hr />
//       <Calendar
//         value={dateRange}
//         disabledDates={disabledDates}
//         onChange={(value) => 
//           onChangeDate(value.selection)}
//       />
//       <hr />
//       <div className="p-4">
//         <Button 
//           disabled={disabled} 
//           label="Reserve" 
//           onClick={onSubmit}
//         />
//       </div>
//       <hr />
//       <div 
//         className="flex flex-row items-center justify-between p-4 text-lg font-semibold //"
//       >
//         <div>
//           Total
//         </div>
//         <div>
//           $ {totalPrice}
//         </div>
//       </div>
//     </div>
//    );
// }
 
// export default ListingReservation;