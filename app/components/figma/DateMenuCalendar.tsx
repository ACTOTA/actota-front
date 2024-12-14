import generateCalendarData from '@/app/libs/calendarData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react';



function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}


export default function DateMenuCalendar() {

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const goBack = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  const goForward = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }


  const months = React.useMemo(() => {
    const calendarData = generateCalendarData(currentYear, currentMonth);
    console.log(calendarData);
    return calendarData;
  }, [currentMonth, currentYear]);



  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  }, []);

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-1 gap-x-14 md:grid-cols-2">
        <button
          type="button"
          className="absolute -left-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" onClick={goBack} />
        </button>
        <button
          type="button"
          className="absolute -right-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" onClick={goForward} />
        </button>
        {months.map((month, monthIdx) => (
          <section
            key={monthIdx}
            className={classNames(monthIdx === months.length - 1 && 'hidden md:block', 'text-center')}
          >
            <h2 className="text-sm font-semibold text-neutral-06">{month.name} {month.days[15].date.split("-")[0]}</h2>
            <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg text-sm">
              {month.days.map((day, dayIdx) => (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    day.isCurrentMonth ? 'text-neural-06' : 'text-gray-700',
                    dayIdx === 0 && 'rounded-tl-lg',
                    dayIdx === 6 && 'rounded-tr-lg',
                    dayIdx === month.days.length - 7 && 'rounded-bl-lg',
                    dayIdx === month.days.length - 1 && 'rounded-br-lg',
                    'relative py-1.5 hover:bg-red-500 hover:bg-opacity-15 hover:rounded-lg focus:z-10',
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      day.isToday && 'relative',
                      'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
                    )}
                  >
                    {day.isToday && (
                      <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full red-04"></span>
                    )}{day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

