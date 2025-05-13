'use client';

import React from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import Button from '@/src/components/figma/Button';
import DayContainer from './DayContainer';
import ActivitySummary from './ActivitySummary';
import { sortDayNumbers } from '../utils';
import { DayItem, Activity, ActiveSearchItem } from '../types';

interface DaysSectionProps {
  days: { [key: string]: DayItem[] };
  day_durations?: Record<string, number>; // Add day_durations prop
  renumberNotification: string | null;
  handleAddDay: () => void;
  handleRemoveDay: (dayNumber: string) => void;
  handleAddDayItem: (dayNumber: string, type: 'transportation' | 'activity' | 'accommodation') => void;
  handleRemoveDayItem: (dayNumber: string, itemIndex: number) => void;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
  error: string;
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

const DaysSection: React.FC<DaysSectionProps> = ({
  days,
  day_durations,
  renumberNotification,
  handleAddDay,
  handleRemoveDay,
  handleAddDayItem,
  handleRemoveDayItem,
  handleDayItemChange,
  error,
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
  // Sort day numbers
  const sortedDayNumbers = sortDayNumbers(Object.keys(days));
  const multipledays = sortedDayNumbers.length > 1;

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Itinerary Days</h4>
        <Button
          type="button"
          onClick={handleAddDay}
          variant="secondary"
          size="sm"
          className="flex items-center"
        >
          <BiPlusCircle className="mr-1" /> Add Day
        </Button>
      </div>
      
      {/* Activity Summary - show a count of activities in the itinerary */}
      <ActivitySummary days={days} day_durations={day_durations} />
      
      {error && (
        <div className="mb-4 px-2 py-1 text-sm text-white bg-[#79071D] rounded">
          {error}
        </div>
      )}
      
      {/* Notification for day renumbering */}
      {renumberNotification && (
        <div className="mb-4 px-2 py-1 text-sm bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {renumberNotification}
        </div>
      )}

      {sortedDayNumbers.map((dayNumber) => (
        <DayContainer
          key={dayNumber}
          dayNumber={dayNumber}
          dayItems={days[dayNumber]}
          dayDuration={day_durations ? day_durations[dayNumber] : undefined}
          handleAddDayItem={handleAddDayItem}
          handleRemoveDay={handleRemoveDay}
          handleRemoveDayItem={handleRemoveDayItem}
          handleDayItemChange={handleDayItemChange}
          canRemoveDay={multipledays}
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
      ))}
    </div>
  );
};

export default DaysSection;