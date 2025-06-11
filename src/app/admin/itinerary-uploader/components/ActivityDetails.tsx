'use client';

import React from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { DayItem } from '../types';

interface ActivityDetailsProps {
  item: DayItem;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ item }) => {
  // Only render if this is an activity item with an activity_id
  if (item.type !== 'activity' || !(item as any).activity_id) {
    return null;
  }

  return (
    <div className="mt-1 px-2 py-1 text-xs bg-green-900/20 border border-green-900/30 rounded">
      <div className="flex items-center justify-between">
        <span className="text-green-300 font-medium">
          {(item as any).activity_title || 'Activity selected!'}
        </span>
        {(item as any).activity_duration && (
          <span className="bg-green-900/50 px-2 py-0.5 ml-2 rounded text-xs text-green-200 flex items-center">
            <HiOutlineClock className="mr-1" />
            {(item as any).activity_duration}h
          </span>
        )}
      </div>

      {(item as any).activity_description && (
        <div className="text-gray-300 text-xs mt-1">
          {(item as any).activity_description}
        </div>
      )}

      <div className="flex justify-between mt-1">
        {(item as any).activity_company && (
          <span className="text-gray-400 text-xs">
            Provider: {(item as any).activity_company}
          </span>
        )}

        {(item as any).activity_price && (
          <span className="text-gray-400 text-xs">
            Price: ${(item as any).activity_price}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActivityDetails;