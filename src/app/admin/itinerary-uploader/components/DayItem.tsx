'use client';

import React from 'react';
import { HiX, HiOutlineClock } from 'react-icons/hi';
import { DayItem as DayItemType, Activity, ActiveSearchItem } from '../types';
import TransportationFields from './TransportationFields';
import AccommodationFields from './AccommodationFields';

interface DayItemProps {
  dayNumber: string;
  itemIndex: number;
  item: DayItemType;
  handleRemoveDayItem: (dayNumber: string, itemIndex: number) => void;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
  // Activity search related props - still needed for types but not used by this component anymore
  activitySearchQuery: string;
  activeSearchItem: ActiveSearchItem | null;
  isLoadingActivities: boolean;
  filteredActivities: Activity[];
  activities: Activity[];
  setActivitySearchQuery: (query: string) => void;
  setActiveSearchItem: (item: ActiveSearchItem | null) => void;
  fetchActivities: () => void;
  handleSelectActivity: (activity: Activity, dayNumber: string, itemIndex: number) => void;
}

const DayItem: React.FC<DayItemProps> = ({
  dayNumber,
  itemIndex,
  item,
  handleRemoveDayItem,
  handleDayItemChange,
}) => {
  // This component now only handles transportation and accommodation items
  if (item.type === 'activity') {
    return null;
  }

  return (
    <div className="bg-gray-900/60 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="bg-blue-900/40 px-2 py-1 rounded text-xs uppercase font-bold mr-2">
            {item.type}
          </span>
          <div className="flex items-center">
            <HiOutlineClock className="text-gray-400 mr-1" />
            <select
              value={item.time}
              onChange={(e) => handleDayItemChange(dayNumber, itemIndex, 'time', e.target.value)}
              className="bg-gray-800 border-none focus:ring-0 text-white text-sm py-1 px-2 rounded-md"
            >
              {Array.from({ length: 24 }).map((_, hour) => (
                <React.Fragment key={hour}>
                  <option value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                  </option>
                  <option value={`${hour.toString().padStart(2, '0')}:30`}>
                    {`${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`}
                  </option>
                </React.Fragment>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveDayItem(dayNumber, itemIndex)}
          className="text-gray-400 hover:text-red-500"
        >
          <HiX size={18} />
        </button>
      </div>

      {/* Render the appropriate fields based on item type */}
      {item.type === 'transportation' && (
        <TransportationFields
          dayNumber={dayNumber}
          itemIndex={itemIndex}
          item={item}
          handleDayItemChange={handleDayItemChange}
        />
      )}

      {item.type === 'accommodation' && (
        <AccommodationFields
          dayNumber={dayNumber}
          itemIndex={itemIndex}
          item={item}
          handleDayItemChange={handleDayItemChange}
        />
      )}
    </div>
  );
};

export default DayItem;