import React, { useState, useRef, useEffect } from 'react';

interface TimeWheelProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function TimeWheel({ value, onChange, label }: TimeWheelProps) {
  const [hour, minute] = value.split(':').map(Number);
  const [isEditingHour, setIsEditingHour] = useState(false);
  const [isEditingMinute, setIsEditingMinute] = useState(false);
  const [tempHour, setTempHour] = useState('');
  const [tempMinute, setTempMinute] = useState('');
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const updateTime = (newHour: number, newMinute: number) => {
    const formattedHour = newHour.toString().padStart(2, '0');
    const formattedMinute = newMinute.toString().padStart(2, '0');
    onChange(`${formattedHour}:${formattedMinute}`);
  };

  const handleHourScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newHour = (hour + direction + 24) % 24;
    updateTime(newHour, minute);
  };

  const handleMinuteScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const currentIndex = minutes.indexOf(minute);
    const newIndex = (currentIndex + direction + minutes.length) % minutes.length;
    updateTime(hour, minutes[newIndex]);
  };

  const formatDisplay = (h: number, m: number) => {
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const period = h >= 12 ? 'PM' : 'AM';
    return {
      hour: displayHour.toString().padStart(2, '0'),
      minute: m.toString().padStart(2, '0'),
      period
    };
  };

  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(tempHour || '0', 10);
      let newHour = val;
      
      // Convert 12-hour to 24-hour format
      const period = hour >= 12 ? 'PM' : 'AM';
      if (period === 'PM' && val !== 12) {
        newHour = val + 12;
      } else if (period === 'AM' && val === 12) {
        newHour = 0;
      }
      
      if (newHour >= 0 && newHour < 24) {
        updateTime(newHour, minute);
      }
      setIsEditingHour(false);
      setTempHour('');
    } else if (e.key === 'Escape') {
      setIsEditingHour(false);
      setTempHour('');
    }
  };

  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(tempMinute || '0', 10);
      // Round to nearest 15
      const newMinute = Math.round(val / 15) * 15;
      if (newMinute >= 0 && newMinute < 60) {
        updateTime(hour, newMinute % 60);
      }
      setIsEditingMinute(false);
      setTempMinute('');
    } else if (e.key === 'Escape') {
      setIsEditingMinute(false);
      setTempMinute('');
    }
  };

  const { hour: displayHour, minute: displayMinute, period } = formatDisplay(hour, minute);

  return (
    <div className="flex-1">
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="flex items-center gap-2">
        {/* Hour wheel */}
        <div className="relative">
          {isEditingHour ? (
            <input
              ref={hourInputRef}
              type="text"
              value={tempHour}
              onChange={(e) => setTempHour(e.target.value.replace(/\D/g, '').slice(0, 2))}
              onKeyDown={handleHourKeyDown}
              onBlur={() => {
                setIsEditingHour(false);
                setTempHour('');
              }}
              className="w-12 h-12 text-center bg-gray-800 text-white text-xl font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={displayHour}
              autoFocus
            />
          ) : (
            <div
              ref={hourRef}
              onWheel={handleHourScroll}
              onClick={() => {
                setIsEditingHour(true);
                setTempHour('');
              }}
              className="w-12 h-12 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-center select-none"
            >
              <span className="text-white text-xl font-medium">{displayHour}</span>
            </div>
          )}
        </div>

        <span className="text-white text-xl font-medium">:</span>

        {/* Minute wheel */}
        <div className="relative">
          {isEditingMinute ? (
            <input
              ref={minuteInputRef}
              type="text"
              value={tempMinute}
              onChange={(e) => setTempMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
              onKeyDown={handleMinuteKeyDown}
              onBlur={() => {
                setIsEditingMinute(false);
                setTempMinute('');
              }}
              className="w-12 h-12 text-center bg-gray-800 text-white text-xl font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={displayMinute}
              autoFocus
            />
          ) : (
            <div
              ref={minuteRef}
              onWheel={handleMinuteScroll}
              onClick={() => {
                setIsEditingMinute(true);
                setTempMinute('');
              }}
              className="w-12 h-12 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-center select-none"
            >
              <span className="text-white text-xl font-medium">{displayMinute}</span>
            </div>
          )}
        </div>

        <span className="text-gray-400 text-lg font-medium ml-1">{period}</span>
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        Scroll or click to edit
      </div>
    </div>
  );
}