'use client';

import React from 'react';

interface DescriptionSectionProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  handleChange,
  error
}) => {
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Description</h4>
      
      <div>
        <p className="text-primary-gray text-left mb-1">Trip Description</p>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Enter a detailed description of the trip"
          className={`w-full h-32 bg-black/50 border border-primary-gray rounded-lg p-4 text-white placeholder:text-primary-gray focus:ring-0 focus:outline-none focus:border-white ${
            error ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''
          }`}
        />
        {error && (
          <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;