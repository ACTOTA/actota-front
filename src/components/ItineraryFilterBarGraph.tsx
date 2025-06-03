// components/CustomGraph.js
import React, { useState, useEffect } from "react";

interface ItineraryFilterBarGraphProps {
  bars?: number;
  color?: string;
  maxValue?: number;
  currentValue?: number;
  onValueChange?: (value: number) => void;
  enabled?: boolean;
}

export default function ItineraryFilterBarGraph({ 
  bars = 20, 
  color,
  maxValue = 10000,
  currentValue = 5000,
  onValueChange,
  enabled = true
}: ItineraryFilterBarGraphProps) {
  const [sliderValue, setSliderValue] = useState(currentValue);

  // Update slider when currentValue prop changes
  useEffect(() => {
    setSliderValue(currentValue);
  }, [currentValue]);

  // Generate an array of random heights for the bars
  const barHeights = Array.from({ length: bars }, () =>
    Math.floor(Math.random() * 100)
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    onValueChange?.(value);
  };

  // Calculate percentage for visual representation
  const percentage = (sliderValue / maxValue) * 100;

  return (
    <div className={`flex flex-col items-center w-full max-w-md mx-auto ${!enabled ? 'opacity-50' : ''}`}>
      {/* Graph */}
      <div className="flex items-end space-x-1 w-full h-24 bg-transparent rounded-lg p-2">
        {barHeights.map((height, index) => (
          <div
            key={index}
            style={{
              height: `${(height * percentage) / 100}%`,
              opacity: index < (bars * percentage) / 100 ? 1 : 0.3,
            }}
            className={`w-4 ${color ? `bg-[${color}]` : 'bg-white'} rounded-sm transition-all duration-200`}
          ></div>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min="500"
        max={maxValue}
        step="100"
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={!enabled}
        className={`w-full mt-1 ${color ? `accent-[${color}]` : 'accent-white'} ${!enabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
      
      {/* Price Range Labels */}
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
        <span>$500</span>
        <span>${sliderValue.toLocaleString()}</span>
        <span>${maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
}
