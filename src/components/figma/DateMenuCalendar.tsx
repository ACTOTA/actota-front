import generateCalendarData from '@/src/helpers/calendarData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface DateMenuCalendarProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  itineraryLength?: number; // Number of days for the itinerary
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  allowManualDateRange?: boolean; // Allow manual selection of date range
}

export default function DateMenuCalendar({ onDateRangeChange, itineraryLength = 1, initialStartDate = null, initialEndDate = null, allowManualDateRange = false }: DateMenuCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);

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
    
    // Check if date is in the past or today
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      return; // Don't allow selection of today or past dates
    }
    
    if (allowManualDateRange) {
      // Manual date range selection mode
      if (!startDate || (startDate && endDate)) {
        // No dates selected or both dates already selected - start new selection
        setStartDate(date);
        setEndDate(null);
        onDateRangeChange(date, null);
      } else if (startDate && !endDate) {
        // Start date selected, now selecting end date
        const startDateObj = new Date(startDate);
        const selectedDateObj = new Date(date);
        
        if (selectedDateObj < startDateObj) {
          // Selected date is before start date - reset to new start date
          setStartDate(date);
          setEndDate(null);
          onDateRangeChange(date, null);
        } else {
          // Valid end date
          setEndDate(date);
          onDateRangeChange(startDate, date);
        }
      }
    } else {
      // Automatic date range calculation based on itinerary length
      const newStartDate = date;
      
      // Calculate end date based on itinerary length
      const startDateObj = new Date(date);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(startDateObj.getDate() + (itineraryLength - 1)); // -1 because start date counts as day 1
      
      const newEndDate = endDateObj.toISOString().split('T')[0];

      setStartDate(newStartDate);
      setEndDate(newEndDate);
      
      // Send the actual ISO date strings to the parent
      onDateRangeChange(newStartDate, newEndDate);
    }
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

  const isPastDate = (date: string) => {
    const checkDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return checkDate < tomorrow;
  }

  return (
    <div className="w-full">
      {/* Selection hint for manual mode */}
      {allowManualDateRange && (
        <div className="text-center text-sm text-gray-300 mb-2">
          {!startDate || (startDate && endDate) 
            ? "Select start date" 
            : "Select end date"}
        </div>
      )}
      <div className="relative">
        {/* Navigation buttons */}
        <button
          type="button"
          className="absolute left-0 top-0 flex items-center justify-center p-1 text-gray-400 hover:text-white transition-colors z-10"
          onClick={goBack}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="absolute right-0 top-0 flex items-center justify-center p-1 text-gray-400 hover:text-white transition-colors z-10"
          onClick={goForward}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="grid grid-cols-1">
        {months.slice(0, 1).map((month, monthIdx) => (
          <section
            key={monthIdx}
            className="text-center"
          >
            <h2 className="text-base font-semibold text-white mb-2">{month.name} {month.days[15].date.split("-")[0]}</h2>
            <div className="grid grid-cols-7 text-xs text-gray-300 mb-1 font-medium">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="isolate mt-1 grid grid-cols-7 gap-px rounded-lg text-sm">
              {month.days.map((day, dayIdx) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => handleDateSelect(day.date, day.isCurrentMonth)}
                  disabled={!day.isCurrentMonth || isPastDate(day.date)}
                  className={classNames(
                    day.isCurrentMonth && !isPastDate(day.date) ? 'text-white font-medium' : 'text-gray-400 cursor-default',
                    isPastDate(day.date) && 'opacity-30 cursor-not-allowed',
                    'relative py-1.5 text-sm',
                    day.isCurrentMonth && !isPastDate(day.date) && 'hover:bg-blue-500/20 hover:rounded focus:z-10 cursor-pointer',
                    isStart(day.date, day.isCurrentMonth) && 'bg-blue-500 text-white rounded',
                    isEnd(day.date, day.isCurrentMonth) && 'bg-blue-500 text-white rounded',
                    isInRange(day.date, day.isCurrentMonth) && 'bg-blue-500/20'
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      day.isToday && 'relative',
                      'mx-auto flex h-7 w-7 items-center justify-center rounded text-sm'
                    )}
                  >
                    {day.isToday && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
                    )}
                    {day.date?.split('-').pop()?.replace(/^0/, '') || ''}
                  </time>
                </button>
              ))}
            </div>
          </section>
        ))}
        </div>
      </div>
    </div>
  )
}

