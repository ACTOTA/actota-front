// components/CustomGraph.js
import React, { useState, useEffect } from "react";

// Configuration constants
export const BUDGET_CONFIG = {
  MIN_VALUE: 0,
  MAX_VALUE: 5000,
  STEP_SIZE: 50,
  DEFAULT_VALUE: 2500
} as const;

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
  maxValue = BUDGET_CONFIG.MAX_VALUE,
  currentValue = BUDGET_CONFIG.DEFAULT_VALUE,
  onValueChange,
  enabled = true
}: ItineraryFilterBarGraphProps) {
  const [sliderValue, setSliderValue] = useState(currentValue);

  // Update slider when currentValue prop changes
  useEffect(() => {
    setSliderValue(currentValue);
  }, [currentValue]);

  // Generate an array of heights that show price increase trend
  const barHeights = Array.from({ length: bars }, (_, index) => {
    // Create a base trend that increases over time
    const baseTrend = 20 + (index / bars) * 60; // Start at 20, increase to 80
    
    // Add some realistic variation (smaller fluctuations)
    const variation = (Math.random() - 0.5) * 20; // ±10 variation
    
    // Add some seasonal/periodic patterns
    const seasonalPattern = Math.sin((index / bars) * Math.PI * 2) * 10;
    
    // Combine all factors and ensure it's within bounds
    const height = Math.max(10, Math.min(100, baseTrend + variation + seasonalPattern));
    
    return Math.floor(height);
  });

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
        min={BUDGET_CONFIG.MIN_VALUE}
        max={maxValue}
        step={BUDGET_CONFIG.STEP_SIZE}
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={!enabled}
        className={`w-full mt-1 ${color ? `accent-[${color}]` : 'accent-white'} ${!enabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
      
      {/* Price Range Labels */}
      <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
        <span>${BUDGET_CONFIG.MIN_VALUE}</span>
        <span>${sliderValue.toLocaleString()}</span>
        <span>${maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
}
