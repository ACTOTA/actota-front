// components/CustomGraph.js
import React, { useState } from "react";

export default function ItineraryFilterBarGraph({ bars = 20, color }: { bars?: number, color?: string }) {
  const [sliderValue, setSliderValue] = useState(50);

  // Generate an array of random heights for the bars
  const barHeights = Array.from({ length: bars }, () =>
    Math.floor(Math.random() * 100)
  );

  const handleSliderChange = (e:any) => {
    setSliderValue(e.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Graph */}
      <div className="flex items-end space-x-1 w-full h-24 bg-transparent rounded-lg p-2">
        {barHeights.map((height, index) => (
          <div
            key={index}
            style={{
              height: `${(height * sliderValue) / 100}%`,
              opacity: index < (bars * sliderValue) / 100 ? 1 : 0.5,
            }}
            className={`w-4 bg-[${color}] rounded-sm`}
          ></div>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        className={`w-full mt-1 accent-[${color}]`}
        
      />
    </div>
  );
}
