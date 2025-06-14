'use client';

import React from 'react';
import Input from '@/src/components/figma/Input';
import { formatCoordinates } from '../utils';

// Add interface for the item type
interface TransportationItem {
  name: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
}

interface TransportationFieldsProps {
  dayNumber: string;
  itemIndex: number;
  item: TransportationItem;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
}

const TransportationFields: React.FC<TransportationFieldsProps> = ({
  dayNumber,
  itemIndex,
  item,
  handleDayItemChange,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-primary-gray text-left mb-1 text-sm">Transportation Name</p>
        <Input
          type="text"
          value={item.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDayItemChange(dayNumber, itemIndex, 'name', e.target.value)}
          placeholder="e.g. Shuttle to Hotel"
        />
      </div>
      
      <div>
        <p className="text-primary-gray text-left mb-1 text-sm">Location Name</p>
        <Input
          type="text"
          value={item.location.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDayItemChange(dayNumber, itemIndex, 'location.name', e.target.value)}
          placeholder="e.g. Denver International Airport"
        />
      </div>
      
      <div>
        <p className="text-primary-gray text-left mb-1 text-sm">Location Coordinates (lat, lng)</p>
        <Input
          type="text"
          value={formatCoordinates(item.location.coordinates)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDayItemChange(dayNumber, itemIndex, 'location.coordinates', e.target.value)}
          placeholder="e.g. 39.7392, -104.9903"
        />
      </div>
    </div>
  );
};

export default TransportationFields;