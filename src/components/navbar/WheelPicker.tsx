import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import GlassPanel from '../figma/GlassPanel';

interface WheelPickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function WheelPicker({ value, onChange, label }: WheelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const modalRef = useRef<HTMLDivElement>(null);
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);
  const periodWheelRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const periods = ['AM', 'PM'];

  const ITEM_HEIGHT = 48;

  // Initialize from value
  useEffect(() => {
    const [hour, minute] = value.split(':').map(Number);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    
    setSelectedHour(displayHour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
  }, [value]);

  // Scroll to selected values when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const hourIndex = hours.indexOf(selectedHour);
        const minuteIndex = minutes.indexOf(selectedMinute);
        const periodIndex = periods.indexOf(selectedPeriod);

        if (hourWheelRef.current && hourIndex >= 0) {
          hourWheelRef.current.scrollTop = hourIndex * ITEM_HEIGHT;
        }
        if (minuteWheelRef.current && minuteIndex >= 0) {
          minuteWheelRef.current.scrollTop = minuteIndex * ITEM_HEIGHT;
        }
        if (periodWheelRef.current && periodIndex >= 0) {
          periodWheelRef.current.scrollTop = periodIndex * ITEM_HEIGHT;
        }
      }, 100);
    }
  }, [isOpen, selectedHour, selectedMinute, selectedPeriod]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTimeChange = (newHour: number, newMinute: number, newPeriod: string) => {
    let hour24 = newHour;
    if (newPeriod === 'PM' && newHour !== 12) {
      hour24 = newHour + 12;
    } else if (newPeriod === 'AM' && newHour === 12) {
      hour24 = 0;
    }
    
    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    setSelectedPeriod(newPeriod);
    onChange(`${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`);
  };

  const scrollToItem = (wheelRef: React.RefObject<HTMLDivElement>, index: number) => {
    if (wheelRef.current) {
      wheelRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (type: 'hour' | 'minute' | 'period') => {
    return (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const scrollTop = element.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      
      if (type === 'hour' && index >= 0 && index < hours.length) {
        const newHour = hours[index];
        handleTimeChange(newHour, selectedMinute, selectedPeriod);
      } else if (type === 'minute' && index >= 0 && index < minutes.length) {
        const newMinute = minutes[index];
        handleTimeChange(selectedHour, newMinute, selectedPeriod);
      } else if (type === 'period' && index >= 0 && index < periods.length) {
        const newPeriod = periods[index];
        handleTimeChange(selectedHour, selectedMinute, newPeriod);
      }
    };
  };

  const handleItemClick = (type: 'hour' | 'minute' | 'period', value: number | string) => {
    if (type === 'hour') {
      const hourIndex = hours.indexOf(value as number);
      scrollToItem(hourWheelRef, hourIndex);
      handleTimeChange(value as number, selectedMinute, selectedPeriod);
    } else if (type === 'minute') {
      const minuteIndex = minutes.indexOf(value as number);
      scrollToItem(minuteWheelRef, minuteIndex);
      handleTimeChange(selectedHour, value as number, selectedPeriod);
    } else if (type === 'period') {
      const periodIndex = periods.indexOf(value as string);
      scrollToItem(periodWheelRef, periodIndex);
      handleTimeChange(selectedHour, selectedMinute, value as string);
    }
  };

  const formatDisplay = () => {
    return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
  };

  return (
    <>
      <div className="flex-1">
        <div className="text-gray-400 text-sm mb-2">{label}</div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full bg-transparent border-b border-gray-600 pb-2 flex items-center justify-between text-white hover:border-gray-400 transition-colors"
        >
          <span className="text-lg">{formatDisplay()}</span>
          <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <GlassPanel
            ref={modalRef}
            variant="dark"
            rounded="lg"
            className="relative p-6 w-full max-w-md mx-4 overflow-visible"
          >
            <h3 className="text-white text-lg font-medium mb-4 text-center">{label}</h3>
            
            <div className="flex justify-center gap-4 h-48 relative">
              {/* Selection indicator */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-blue-500/20 border-t border-b border-blue-400/50 pointer-events-none rounded-lg" />
              
              {/* Hour wheel */}
              <div className="relative w-16">
                <div 
                  ref={hourWheelRef}
                  className="h-full overflow-y-auto scroll-smooth"
                  onScroll={handleScroll('hour')}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                  {hours.map((hour, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center cursor-pointer transition-all"
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick('hour', hour)}
                    >
                      <span className={`text-xl font-medium transition-all ${
                        selectedHour === hour ? 'text-white scale-110' : 'text-gray-400'
                      }`}>
                        {hour.toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                </div>
              </div>

              <div className="text-white text-xl font-medium flex items-center">:</div>

              {/* Minute wheel */}
              <div className="relative w-16">
                <div 
                  ref={minuteWheelRef}
                  className="h-full overflow-y-auto scroll-smooth"
                  onScroll={handleScroll('minute')}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                  {minutes.map((minute, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center cursor-pointer transition-all"
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick('minute', minute)}
                    >
                      <span className={`text-xl font-medium transition-all ${
                        selectedMinute === minute ? 'text-white scale-110' : 'text-gray-400'
                      }`}>
                        {minute.toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                </div>
              </div>

              {/* Period wheel */}
              <div className="relative w-16 ml-2">
                <div 
                  ref={periodWheelRef}
                  className="h-full overflow-y-auto scroll-smooth"
                  onScroll={handleScroll('period')}
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                  {periods.map((period, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center cursor-pointer transition-all"
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick('period', period)}
                    >
                      <span className={`text-lg font-medium transition-all ${
                        selectedPeriod === period ? 'text-white scale-110' : 'text-gray-400'
                      }`}>
                        {period}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </GlassPanel>
        </div>
      )}
    </>
  );
}