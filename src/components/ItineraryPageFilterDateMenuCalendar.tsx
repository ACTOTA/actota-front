import generateCalendarData from '@/src/helpers/calendarData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface DateMenuCalendarProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

export default function ItineraryPageFilterDateMenuCalendar({ onDateRangeChange }: DateMenuCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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
    return calendarData;
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  }, []);


  const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return; // Prevent selection of non-current month days
    
    let newStartDate = startDate;
    let newEndDate = endDate;

    if (!startDate || (startDate && endDate)) {
      newStartDate = date;
      newEndDate = null;
    } else {
      if (new Date(date) < new Date(startDate)) {
        newEndDate = startDate;
        newStartDate = date;
      } else {
        newEndDate = date;
      }
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onDateRangeChange(newStartDate, newEndDate);
  }


  const isInRange = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    if (!startDate || !endDate) return false;
    const currentDate = new Date(date);
    return currentDate > new Date(startDate) && currentDate < new Date(endDate);
  }
  const isStart = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    return date === startDate;
  }
  const isEnd = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    return date === endDate;
  }

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-1 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-x-14 ">
        <button
          type="button"
          className="absolute -left-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={goBack}
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="absolute -right-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={goForward}
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {months.map((month, monthIdx) => (
          <section
            key={monthIdx}
            className={classNames(monthIdx === months.length - 1 && 'hidden max-lg:block max-sm:hidden', 'text-center')}
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
                  onClick={() => handleDateSelect(day.date, day.isCurrentMonth)}
                  disabled={!day.isCurrentMonth}
                  className={classNames(
                    day.isCurrentMonth ? 'text-neutral-06' : 'text-gray-400 cursor-default hover:bg-transparent',
                    dayIdx === 0 && 'rounded-tl-lg',
                    dayIdx === 6 && 'rounded-tr-lg',
                    dayIdx === month.days.length - 7 && 'rounded-bl-lg',
                    dayIdx === month.days.length - 1 && 'rounded-br-lg',
                    'relative py-1.5',
                    day.isCurrentMonth && 'hover:bg-red-500 hover:bg-opacity-15 hover:rounded-lg focus:z-10',
                    isStart(day.date, day.isCurrentMonth) && 'bg-white text-black rounded-l-lg',
                    isEnd(day.date, day.isCurrentMonth) && 'bg-white text-black rounded-r-lg',
                    isInRange(day.date, day.isCurrentMonth) && 'translucent-white20 text-white'
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
                    )}{day.date?.split('-').pop()?.replace(/^0/, '') || ''}
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

