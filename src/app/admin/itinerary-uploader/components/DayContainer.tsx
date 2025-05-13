'use client';

import React from 'react';
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';
import { HiOutlineCalendar } from 'react-icons/hi';
import Button from '@/src/components/figma/Button';
import DayItem from './DayItem';
import DayActivitiesSearch from './DayActivitiesSearch';
import { DayItem as DayItemType, Activity, ActiveSearchItem } from '../types';

interface DayContainerProps {
  dayNumber: string;
  dayItems: DayItemType[];
  dayDuration?: number; // Add dayDuration prop
  handleAddDayItem: (dayNumber: string, type: 'transportation' | 'activity' | 'accommodation') => void;
  handleRemoveDay: (dayNumber: string) => void;
  handleRemoveDayItem: (dayNumber: string, itemIndex: number) => void;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
  canRemoveDay: boolean;
  // Activity search related props
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

const DayContainer: React.FC<DayContainerProps> = ({
  dayNumber,
  dayItems,
  dayDuration,
  handleAddDayItem,
  handleRemoveDay,
  handleRemoveDayItem,
  handleDayItemChange,
  canRemoveDay,
  activitySearchQuery,
  activeSearchItem,
  isLoadingActivities,
  filteredActivities,
  activities,
  setActivitySearchQuery,
  setActiveSearchItem,
  fetchActivities,
  handleSelectActivity,
}) => {
  // Filter out activity items - they'll be handled by DayActivitiesSearch
  const nonActivityItems = dayItems.filter(item => item.type !== 'activity');

  return (
    <div className="border border-gray-700 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h5 className="text-md font-medium flex items-center">
            <HiOutlineCalendar className="mr-2" />
            <span className="bg-blue-900/40 px-2 py-1 rounded-md">Day {dayNumber}</span>
          </h5>
          {dayDuration !== undefined && (
            <span className="bg-green-900/40 px-2 py-1 rounded-md text-xs font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {dayDuration} hours
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => handleAddDayItem(dayNumber, 'transportation')}
            variant="secondary"
            size="sm"
          >
            + Transport
          </Button>
          <Button
            type="button"
            onClick={() => handleAddDayItem(dayNumber, 'accommodation')}
            variant="secondary"
            size="sm"
          >
            + Accommodation
          </Button>
          {canRemoveDay && (
            <button
              type="button"
              onClick={() => handleRemoveDay(dayNumber)}
              className="text-red-500 hover:text-red-600"
            >
              <BiMinusCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {nonActivityItems.length === 0 ? (
        <p className="text-gray-500 italic text-center py-3">No transportation or accommodation items yet</p>
      ) : (
        <div className="space-y-4">
          {nonActivityItems.map((item, idx) => {
            // Find the original index in the full dayItems array
            const originalIndex = dayItems.findIndex((di, i) => di === item);

            return (
              <DayItem
                key={idx}
                dayNumber={dayNumber}
                itemIndex={originalIndex}
                item={item}
                handleRemoveDayItem={handleRemoveDayItem}
                handleDayItemChange={handleDayItemChange}
                activitySearchQuery={activitySearchQuery}
                activeSearchItem={activeSearchItem}
                isLoadingActivities={isLoadingActivities}
                filteredActivities={filteredActivities}
                activities={activities}
                setActivitySearchQuery={setActivitySearchQuery}
                setActiveSearchItem={setActiveSearchItem}
                fetchActivities={fetchActivities}
                handleSelectActivity={handleSelectActivity}
              />
            );
          })}
        </div>
      )}

      {/* Activities section with unified search */}
      <DayActivitiesSearch
        dayNumber={dayNumber}
        dayItems={dayItems}
        activitySearchQuery={activitySearchQuery}
        activeSearchItem={activeSearchItem}
        isLoadingActivities={isLoadingActivities}
        filteredActivities={filteredActivities}
        activities={activities}
        setActivitySearchQuery={setActivitySearchQuery}
        setActiveSearchItem={setActiveSearchItem}
        fetchActivities={fetchActivities}
        handleSelectActivity={handleSelectActivity}
        handleAddDayItem={handleAddDayItem}
        handleRemoveDayItem={handleRemoveDayItem}
        handleDayItemChange={handleDayItemChange}
      />
    </div>
  );
};

export default DayContainer;