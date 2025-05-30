import React, { useState, useEffect } from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';
import GlassPanel from '../figma/GlassPanel';
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from './constants';
import WheelPicker from './WheelPicker';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getDateRangeDisplay = () => {
    if (!startDate && !endDate) return 'Select Date';
    if (startDate && !endDate) return startDate;
    if (startDate && endDate && startDate === endDate) return startDate;
    if (startDate && endDate) return `${startDate} → ${endDate}`;
    return 'Select Date';
  };

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  }

  // Validate that end time is after start time
  useEffect(() => {
    if (startDate && endDate && startDate === endDate) {
      // If same day, ensure end time is after start time
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (endMinutes <= startMinutes) {
        // Set end time to 1 hour after start time
        const newEndMinutes = startMinutes + 60;
        const newEndHour = Math.floor(newEndMinutes / 60) % 24;
        const newEndMin = newEndMinutes % 60;
        setEndTime(`${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`);
      }
    }
  }, [startTime, endTime, startDate, endDate]);

  return (
    <GlassPanel
      {...getMobileGlassPanelProps(isMobile)}
      className={`w-full mx-auto flex flex-col ${isMobile ? MOBILE_GLASS_PANEL_STYLES : ''} ${className}`}
    >
      {/* Date Range Header */}
      <div className="w-full text-center mb-2">
        <h3 className="text-white text-base font-medium">{getDateRangeDisplay()}</h3>
      </div>

      <DateMenuCalendar onDateRangeChange={handleDateRangeChange} />

      {/* Time Selectors */}
      <div className='w-full mt-2 border-t border-gray-700 pt-3'>
        <div className='flex gap-4 justify-center'>
          <WheelPicker
            value={startTime}
            onChange={setStartTime}
            label="Start Time"
          />
          <WheelPicker
            value={endTime}
            onChange={setEndTime}
            label="End Time"
          />
        </div>
      </div>
      
      {/* Booking note */}
      <div className="text-center text-xs text-gray-500 mt-1">
        * Minimum 1 day advance booking required
      </div>
    </GlassPanel>
  );
}
