'use client';

import React from 'react';
import Input from '@/src/components/figma/Input';

interface BasicInfoSectionProps {
  tripName: string;
  fareharborId: number | undefined;
  minAge: number | undefined;
  minGroup: number;
  maxGroup: number;
  lengthDays: number;
  lengthHours: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    trip_name: string;
    min_group: string;
    max_group: string;
  };
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  tripName,
  fareharborId,
  minAge,
  minGroup,
  maxGroup,
  lengthDays,
  lengthHours,
  handleChange,
  errors
}) => {
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-primary-gray text-left mb-1">Trip Name</p>
          <Input
            type="text"
            name="trip_name"
            value={tripName}
            onChange={handleChange}
            placeholder="Enter trip name"
            classname={errors.trip_name ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.trip_name && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.trip_name}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-primary-gray text-left mb-1">FareHarbor ID (Optional)</p>
          <Input
            type="number"
            name="fareharbor_id"
            value={fareharborId?.toString() || ''}
            onChange={handleChange}
            placeholder="Enter FareHarbor ID if available"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-primary-gray text-left mb-1">Minimum Age (Optional)</p>
          <Input
            type="number"
            name="min_age"
            value={minAge?.toString() || ''}
            onChange={handleChange}
            placeholder="Minimum age requirement"
          />
        </div>
        
        <div>
          <p className="text-primary-gray text-left mb-1">Min Group Size</p>
          <Input
            type="number"
            name="min_group"
            value={minGroup.toString()}
            onChange={handleChange}
            placeholder="Minimum group size"
            classname={errors.min_group ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.min_group && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.min_group}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-primary-gray text-left mb-1">Max Group Size</p>
          <Input
            type="number"
            name="max_group"
            value={maxGroup.toString()}
            onChange={handleChange}
            placeholder="Maximum group size"
            classname={errors.max_group ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
          />
          {errors.max_group && (
            <div className="mt-1 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.max_group}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-primary-gray text-left mb-1">Length (Days) <span className="text-xs text-gray-400">(auto-calculated)</span></p>
          <Input
            type="number"
            name="length_days"
            value={lengthDays.toString()}
            readOnly={true}
            placeholder="Auto-calculated from days"
            classname="bg-gray-900/30 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-400">Based on number of days in itinerary</p>
        </div>

        <div>
          <p className="text-primary-gray text-left mb-1">Length (Hours) <span className="text-xs text-gray-400">(auto-calculated)</span></p>
          <Input
            type="number"
            name="length_hours"
            value={lengthHours.toString()}
            readOnly={true}
            placeholder="Auto-calculated from activities"
            classname="bg-gray-900/30 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-400">
            Based solely on sum of activity durations
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-900/40 text-green-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {lengthHours} hours
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;