'use client';

import React from 'react';
import { BiMap } from 'react-icons/bi';
import Input from '@/src/components/figma/Input';
import { formatCoordinates } from '../utils';
import { Location } from '../types';

interface LocationsSectionProps {
  startLocation: Location;
  endLocation: Location;
  handleLocationChange: (locationKey: 'start_location' | 'end_location', field: keyof Location, value: string) => void;
  errors: {
    start_location: string;
    end_location: string;
  };
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  startLocation,
  endLocation,
  handleLocationChange,
  errors
}) => {
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Locations</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Location */}
        <div className="border border-gray-700 p-4 rounded-lg">
          <h5 className="text-md font-medium mb-3">Start Location</h5>
          
          <div className="space-y-3">
            <div>
              <p className="text-primary-gray text-left mb-1">City</p>
              <Input
                type="text"
                value={startLocation.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('start_location', 'city', e.target.value)}
                placeholder="City"
                icon={<BiMap size={20} />}
                classname={errors.start_location ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
            </div>
            
            <div>
              <p className="text-primary-gray text-left mb-1">State</p>
              <Input
                type="text"
                value={startLocation.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('start_location', 'state', e.target.value)}
                placeholder="State"
                classname={errors.start_location ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
            </div>
            
            <div>
              <p className="text-primary-gray text-left mb-1">Coordinates (lat, lng)</p>
              <Input
                type="text"
                value={formatCoordinates(startLocation.coordinates)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('start_location', 'coordinates', e.target.value)}
                placeholder="e.g. 39.7392, -104.9903"
              />
            </div>
          </div>
          
          {errors.start_location && (
            <div className="mt-3 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.start_location}
            </div>
          )}
        </div>
        
        {/* End Location */}
        <div className="border border-gray-700 p-4 rounded-lg">
          <h5 className="text-md font-medium mb-3">End Location</h5>
          
          <div className="space-y-3">
            <div>
              <p className="text-primary-gray text-left mb-1">City</p>
              <Input
                type="text"
                value={endLocation.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('end_location', 'city', e.target.value)}
                placeholder="City"
                icon={<BiMap size={20} />}
                classname={errors.end_location ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
            </div>
            
            <div>
              <p className="text-primary-gray text-left mb-1">State</p>
              <Input
                type="text"
                value={endLocation.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('end_location', 'state', e.target.value)}
                placeholder="State"
                classname={errors.end_location ? 'border-[#79071D] ring-1 ring-[#79071D]' : ''}
              />
            </div>
            
            <div>
              <p className="text-primary-gray text-left mb-1">Coordinates (lat, lng)</p>
              <Input
                type="text"
                value={formatCoordinates(endLocation.coordinates)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('end_location', 'coordinates', e.target.value)}
                placeholder="e.g. 39.7392, -104.9903"
              />
            </div>
          </div>
          
          {errors.end_location && (
            <div className="mt-3 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
              {errors.end_location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;