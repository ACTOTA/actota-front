export default function ListingDays({ days, day, setDay, towns }) {
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
    <nav aria-label="Progress" className="listing-days-container">
      <div className="relative flex items-center">
        <button
          className="absolute left-0 z-10 p-2 text-gray-500 bg-white rounded-full shadow hover:text-gray-700"
          onClick={handleLeftArrowClick}
        >
          {/* Replace with an appropriate left arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <ol role="list" className="flex pl-8 pr-8 space-x-2 overflow-x-auto no-space-y thin-scrollbar">
          {Object.entries(days).map(([dayId, currDay], index) => (
            <li key={dayId} onClick={() => handleDayClick(dayId)}
                className={`flex-none px-3 py-2 rounded-full text-center cursor-pointer
                            transition-all duration-200 ease-in-out select-none
                            ${dayId === day ? 'bg-slate-200 text-logo-blue' : 'text-gray-500 hover:bg-slate-100'}
                            ${dayId === day ? 'border-logo-blue' : 'hover:text-gray-700'} border border-transparent`}>
              <span className="block text-sm font-medium">{dayId === '1' ? 'Arrival' : dayId === String(Object.keys(days).length) ? 'Departure' : `Day ${dayId}`}</span>
            </li>
          ))}
        </ol>
        <button
          className="absolute right-0 z-10 p-2 text-gray-500 bg-white rounded-full shadow hover:text-gray-700"
          onClick={handleRightArrowClick}
        >
          {/* Replace with an appropriate right arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
