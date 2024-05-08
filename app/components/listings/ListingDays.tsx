

const days = [
  { id: 'Day 1', href: '#', town: 'Arrival',  activities: 'A1,A2,A3', status: 'complete' },
  { id: 'Day 2', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'complete' },
  { id: 'Day 3', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'in progress' },
  { id: 'Day 4', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'complete' },
  { id: 'Day 5', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'upcoming' },
  { id: 'Day 6', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'upcoming' },
  { id: 'Day 7', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'complete' },
  { id: 'Day 8', href: '#', town: 'Town',  activities: 'A1,A2,A3', status: 'complete' },

]


//TODO: Move id above icon so it shows the day number above the icon
//insert selected towns from the backend and insert where it says 'Towns' above^^
//set last day = departure
//set first day = arrival
//set current day = day clicked. current day should be the only one that is highlighted


export default function Example() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {days.map((day) => (
          <li key={day.town} className="md:flex-1">
            {day.status === 'complete' ? (
              <a
                href={day.href}
                className="flex flex-col py-2 pl-4 border-l-4 border-logo-blue group hover:border-logo-blue md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-logo-blue group-hover:text-logo-blue">{day.id}</span>
                <span className="text-sm font-medium">{day.town}</span>
                <span className="text-sm font-medium">{day.activities}</span>
              </a>
            ) : day.status === 'current' ? (
              <a
                href={day.href}
                className="flex flex-col py-2 pl-4 border-l-4 border-logo-blue md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current={true}
              >
                <span className="text-sm font-medium text-logo-blue">{day.id}</span>
                <span className="text-sm font-medium">{day.town}</span>
              </a>
            ) : (
              <a
                href={day.href}
                className="flex flex-col py-2 pl-4 border-l-4 border-gray-200 group hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{day.id}</span>
                <span className="text-sm font-medium">{day.town}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
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
