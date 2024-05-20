

//TODO: Move id above icon so it shows the day number above the icon
//insert selected towns from the backend and insert where it says 'Towns' above^^
//set last day = departure
//set first day = arrival
//set current day = day clicked. current day should be the only one that is highlighted

export default function ListingDays({ days, day, setDay }) {
  const handleDayClick = (dayId) => {
    setDay(dayId);
  };

  const handleLeftArrowClick = () => {
    const dayIds = Object.keys(days);
    const currentIndex = dayIds.indexOf(day);
    if (currentIndex > 0) {
      setDay(dayIds[currentIndex - 1]);
    }
  };

  const handleRightArrowClick = () => {
    const dayIds = Object.keys(days);
    const currentIndex = dayIds.indexOf(day);
    if (currentIndex < dayIds.length - 1) {
      setDay(dayIds[currentIndex + 1]);
    }
  };

  return (
    <nav aria-label="Progress">
      <div className="relative flex items-center">
        <button
          className="absolute left-0 z-10 p-2 text-gray-500 bg-white rounded-full shadow hover:text-gray-700"
          onClick={handleLeftArrowClick}
        >
          {/* Replace with an appropriate left arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <ol role="list" className="flex pb-2 pl-8 pr-8 space-x-2 overflow-x-auto">
          {Object.entries(days).map(([dayId, currDay]) => (
            <li key={dayId} onClick={() => handleDayClick(dayId)}
                className={`flex-none px-3 py-2 rounded-full text-center cursor-pointer
                            transition-all duration-200 ease-in-out select-none
                            ${dayId === day ? 'bg-slate-200 text-logo-blue' : 'text-gray-500 hover:bg-slate-100'}
                            ${dayId === day ? 'border-logo-blue' : 'hover:text-gray-700'} border border-transparent`}>
              <span className="block text-sm font-medium">Day {dayId}</span>
            </li>
          ))}
        </ol>
        <button
          className="absolute right-0 z-10 p-2 text-gray-500 bg-white rounded-full shadow hover:text-gray-700"
          onClick={handleRightArrowClick}
        >
          {/* Replace with an appropriate right arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}




// import { CheckIcon } from '@heroicons/react/20/solid'

// const days = [
//   { name: 'Day 1', href: '#', status: 'complete' },
//   { name: 'Day 2', href: '#', status: 'complete' },
//   { name: 'Day 3', href: '#', status: 'current' },
//   { name: 'Day 4', href: '#', status: 'upcoming' },
//   { name: 'Day 5', href: '#', status: 'upcoming' },
//   { name: 'Day 6', href: '#', status: 'upcoming' },
//   { name: 'Day 7', href: '#', status: 'upcoming' },
//   { name: 'Day 8', href: '#', status: 'upcoming' },
//   { name: 'Day 9', href: '#', status: 'upcoming' },

// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function ListingDays() {
//   return (
//     <nav aria-label="Progress">
//       <ol role="list" className="flex items-center">
//         {days.map((day, dayIdx) => (
//           <li key={day.name} className={classNames(dayIdx !== days.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
//             {day.status === 'complete' ? (
//               <>
//                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
//                   <div className="h-0.5 w-full bg-logo-red" />
//                 </div>
//                 <a
//                   href="#"
//                   className="relative flex items-center justify-center w-8 h-8 rounded-full bg-logo-blue hover:bg-logo-blue"
//                 >
//                   <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
//                   <span className="sr-only">{day.name}</span>
//                 </a>
//               </>
//             ) : day.status === 'current' ? (
//               <>
//                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
//                   <div className="h-0.5 w-full bg-gray-200" />
//                 </div>
//                 <a
//                   href="#"
//                   className="relative flex items-center justify-center w-8 h-8 bg-white border-2 rounded-ful-bluerder-logo-600"
//                   aria-current="day"
//                 >
//                   <span className="h-2.5 w-2.5 rounded-full bg-logo-blue" aria-hidden="true" />
//                   <span className="sr-only">{day.name}</span>
//                 </a>
//               </>
//             ) : (
//               <>
//                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
//                   <div className="h-0.5 w-full bg-gray-200" />
//                 </div>
//                 <a
//                   href="#"
//                   className="relative flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full group hover:border-gray-400"
//                 >
//                   <span
//                     className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
//                     aria-hidden="true"
//                   />
//                   <span className="sr-only">{day.name}</span>
//                 </a>
//               </>
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   )
// }
