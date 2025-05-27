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
    <section className={`w-full mx-auto h-full text-white max-lg:backdrop-blur-none lg:backdrop-blur-lg max-lg:border-0 lg:border lg:border-gray-600 rounded-3xl flex-col justify-center items-center gap-4 px-6 lg:px-8 pt-6 lg:pt-8 pb-6 lg:pb-8 lg:bg-black/80 lg:shadow-2xl ${className}`}>
      <div className="w-full mb-4">
        <h2 className="text-left text-white text-xl font-semibold">When are you traveling?</h2>
        <p className="text-sm text-gray-400 mt-1">Select your trip dates</p>
      </div>

      <DateMenuCalendar onDateRangeChange={handleDateRangeChange} />

      <div className='w-full mt-3 mb-1 mx-auto flex flex-wrap'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="text-gray-300 text-sm font-medium whitespace-nowrap mr-3">Start:</div>
            <select
              value={startTime}
              onChange={handleStartTimeChange}
              className="w-full bg-transparent border-none text-white text-sm font-normal leading-tight appearance-none pl-1 pr-5 cursor-pointer focus:outline-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '0.5em auto'
              }}
            >
              {timeOptions.map(time => (
                <option key={time} value={time} className='bg-gray-900'>{time}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="text-gray-300 text-sm font-medium whitespace-nowrap mr-3">End:</div>
            <select
              value={endTime}
              onChange={handleEndTimeChange}
              className="w-full bg-transparent border-none text-white text-sm font-normal leading-tight appearance-none pl-1 pr-5 cursor-pointer focus:outline-none"
              style={{
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '0.5em auto'
              }}
            >
              {timeOptions.map(time => (
                <option key={time} value={time} className='bg-gray-900'>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
