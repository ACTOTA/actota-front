'use client';

import React from 'react';
import Input from '@/src/components/figma/Input';

interface AccommodationFieldsProps {
  dayNumber: string;
  itemIndex: number;
  item: any; // Using any since we're casting
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
}

const AccommodationFields: React.FC<AccommodationFieldsProps> = ({
  dayNumber,
  itemIndex,
  item,
  handleDayItemChange,
}) => {
  return (
    <div>
      <p className="text-primary-gray text-left mb-1 text-sm">Accommodation ID</p>
      <Input
        type="text"
        value={item.accommodation_id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDayItemChange(dayNumber, itemIndex, 'accommodation_id', e.target.value)}
        placeholder="Enter accommodation ID"
      />
    </div>
  );
};

export default AccommodationFields;