'use client';

import React from 'react';
import Input from '@/src/components/figma/Input';
import ActivitySearch from './ActivitySearch';
import ActivityDetails from './ActivityDetails';
import { Activity, ActiveSearchItem, DayItem } from '../types';

interface ActivityFieldsProps {
  dayNumber: string;
  itemIndex: number;
  item: DayItem;
  activitySearchQuery: string;
  activeSearchItem: ActiveSearchItem | null;
  isLoadingActivities: boolean;
  filteredActivities: Activity[];
  activities: Activity[];
  setActivitySearchQuery: (query: string) => void;
  setActiveSearchItem: (item: ActiveSearchItem | null) => void;
  fetchActivities: () => void;
  handleSelectActivity: (activity: Activity, dayNumber: string, itemIndex: number) => void;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
}

const ActivityFields: React.FC<ActivityFieldsProps> = ({
  dayNumber,
  itemIndex,
  item,
  activitySearchQuery,
  activeSearchItem,
  isLoadingActivities,
  filteredActivities,
  activities,
  setActivitySearchQuery,
  setActiveSearchItem,
  fetchActivities,
  handleSelectActivity,
  handleDayItemChange,
}) => {
  return (
    <div className="space-y-3">
      <ActivitySearch 
        dayNumber={dayNumber}
        itemIndex={itemIndex}
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

      <div>
        <p className="text-primary-gray text-left mb-1 text-sm">Activity ID</p>
        <Input
          type="text"
          value={(item as any).activity_id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDayItemChange(dayNumber, itemIndex, 'activity_id', e.target.value)}
          placeholder="Enter or select activity ID"
          readOnly={(item as any).activity_id !== ''}
          classname={(item as any).activity_id ? 'bg-gray-900/70' : ''}
        />
        <ActivityDetails item={item} />
      </div>
    </div>
  );
};

export default ActivityFields;