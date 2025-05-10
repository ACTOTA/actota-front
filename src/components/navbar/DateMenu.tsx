import React, { useState, useEffect } from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';

interface DateMenuProps {
  updateSearchValue?: (value: string) => void;
  durationValue?: string;
  className?: string;
}

export default function DateMenu({ updateSearchValue, durationValue, className }: DateMenuProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    updateDurationSummary();
  }, [startDate, endDate, startTime, endTime]);

  const updateDurationSummary = () => {
    let summary = '';

    // Exact dates mode
    if (startDate && endDate) {
      summary = `${startDate} - ${endDate}`;
    } else if (startDate) {
      summary = startDate;
    }

    updateSearchValue?.(summary);
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(e.target.value);
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(e.target.value);
  }

  // Generate time options from 00:00 to 23:45 in 15-minute increments
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4).toString().padStart(2, '0');
    const minutes = ((i % 4) * 15).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  return (
    <section className={`w-full mx-auto h-full text-white backdrop-blur-md border-2 border-border-primary rounded-3xl flex-col justify-center items-center gap-2 pl-2 pr-2 md:pl-4 md:pr-4 pt-6 pb-4 ${className}`}>
      <div className="w-full mb-2">
        <h2 className="text-center text-white text-lg font-semibold">Select Dates</h2>
      </div>

      <DateMenuCalendar onDateRangeChange={handleDateRangeChange} />

      <div className='w-full gap-4'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-2'>
          <div className="flex justify-center items-center gap-2 w-full sm:w-auto">
            <div className="text-white text-sm sm:text-base font-bold leading-normal text-center whitespace-nowrap">Start Time</div>
            <div className="flex-col justify-start items-end gap-2 inline-flex flex-1">
              <select
                value={startTime}
                onChange={handleStartTimeChange}
                className="h-10 sm:h-12 bg-transparent border-none text-[#f7f7f7] text-sm sm:text-base font-normal leading-normal z-10"
              >
                {timeOptions.map(time => (
                  <option key={time} value={time} className=''>{time}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="justify-center items-center gap-2 flex w-full sm:w-auto">
            <div className="text-white text-sm sm:text-base font-bold leading-normal whitespace-nowrap">End Time</div>
            <div className="flex-col justify-start items-end gap-2 inline-flex flex-1">
              <select
                value={endTime}
                onChange={handleEndTimeChange}
                className="h-10 sm:h-12 bg-transparent border-none text-[#f7f7f7] text-sm sm:text-base font-normal leading-normal z-10"
              >
                {timeOptions.map(time => (
                  <option key={time} value={time} className=''>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
