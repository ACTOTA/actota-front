import React, { useState, useEffect, useCallback } from 'react';
import DateMenuCalendar from '../figma/DateMenuCalendar';
import GlassPanel from '../figma/GlassPanel';
import { MOBILE_GLASS_PANEL_STYLES, getMobileGlassPanelProps } from './constants';
import WheelPicker from './WheelPicker';

// Helper function to parse date strings safely in local timezone
const parseLocalDate = (dateStr: string): Date => {
  // Parse YYYY-MM-DD format in local timezone instead of UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

interface DateMenuProps {
  updateSearchValue?: (value: string) => void;
  durationValue?: string;
  className?: string;
  onConfirm?: () => void;
  itineraryLength?: number;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  allowManualDateRange?: boolean;
}

export default function DateMenu({ updateSearchValue, durationValue, className, onConfirm, itineraryLength = 1, initialStartDate = null, initialEndDate = null, allowManualDateRange = true }: DateMenuProps) {
  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);
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

  const updateDurationSummary = useCallback(() => {
    if (startDate && endDate) {
      // Create ISO datetime strings with time information
      const arrivalDateTime = `${startDate}T${startTime}:00`;
      const departureDateTime = `${endDate}T${endTime}:00`;
      
      // Calculate duration for display (inclusive of both start and end dates)
      const start = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDifference = Math.round(timeDiff / (1000 * 3600 * 24));
      const durationDays = daysDifference + 1; // +1 to include both start and end dates
      
      // Format dates for display
      const formatDate = (dateStr: string) => {
        const date = parseLocalDate(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      
      const displayText = startDate === endDate 
        ? `${formatDate(startDate)} (1 day)`
        : `${formatDate(startDate)} - ${formatDate(endDate)} (${durationDays} ${durationDays === 1 ? 'day' : 'days'})`;
      
      // Send formatted display text with embedded datetime data
      const searchValue = `${displayText}|${JSON.stringify({
        arrival_datetime: arrivalDateTime,
        departure_datetime: departureDateTime
      })}`;
      
      updateSearchValue?.(searchValue);
    } else if (startDate) {
      // Single date - same arrival and departure
      const arrivalDateTime = `${startDate}T${startTime}:00`;
      const departureDateTime = `${startDate}T${endTime}:00`;
      
      const formatDate = (dateStr: string) => {
        const date = parseLocalDate(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      
      
      const displayText = `${formatDate(startDate)} (1 day)`;
      
      // Send formatted display text with embedded datetime data
      const searchValue = `${displayText}|${JSON.stringify({
        arrival_datetime: arrivalDateTime,
        departure_datetime: departureDateTime
      })}`;
      
      updateSearchValue?.(searchValue);
    } else {
      updateSearchValue?.('');
    }
  }, [startDate, endDate, startTime, endTime, updateSearchValue]);

  useEffect(() => {
    updateDurationSummary();
  }, [updateDurationSummary]);

  const getDateRangeDisplay = () => {
    if (!startDate && !endDate) return 'Select Date';
    
    const formatDate = (dateStr: string) => {
      const date = parseLocalDate(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    if (startDate && !endDate) return formatDate(startDate);
    if (startDate && endDate && startDate === endDate) return formatDate(startDate);
    if (startDate && endDate) {
      const daysDifference = Math.round((parseLocalDate(endDate).getTime() - parseLocalDate(startDate).getTime()) / (1000 * 3600 * 24));
      const durationDays = daysDifference + 1;
      return `${formatDate(startDate)} - ${formatDate(endDate)} (${durationDays} ${durationDays === 1 ? 'day' : 'days'})`;
    }
    return 'Select Date';
  };

  const handleDateRangeChange = useCallback((start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
    // Update immediately when dates change
    setTimeout(() => updateDurationSummary(), 0);
  }, [updateDurationSummary]);

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

      <DateMenuCalendar 
        onDateRangeChange={handleDateRangeChange} 
        itineraryLength={itineraryLength}
        initialStartDate={startDate}
        initialEndDate={endDate}
        allowManualDateRange={allowManualDateRange}
      />

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
      
      {/* Confirm Button */}
      <div className="mt-3 px-4 pb-3">
        <button
          onClick={() => {
            if (startDate && endDate) {
              updateDurationSummary();
              onConfirm?.();
            }
          }}
          disabled={!startDate || !endDate}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg ${
            startDate && endDate
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-[1.02]' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm Dates
        </button>
      </div>
    </GlassPanel>
  );
}
