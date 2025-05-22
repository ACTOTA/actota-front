'use client';

import React from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { DayItem } from '../types';

interface ActivitySummaryProps {
  days: { [key: string]: DayItem[] };
  day_durations?: Record<string, number>;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ days, day_durations }) => {
  // Count total activities and activity hours
  let activityCount = 0;
  let activityHours = 0;

  // Build a list of activities per day for display
  const activitiesByDay: Record<string, {count: number, hours: number}> = {};

  Object.entries(days).forEach(([dayNumber, dayItems]) => {
    let dayActivityCount = 0;
    let dayActivityHours = 0;

    dayItems.forEach(item => {
      if (item.type === 'activity' && (item as any).activity_id) {
        activityCount++;
        dayActivityCount++;

        if ((item as any).activity_duration) {
          const hours = parseFloat((item as any).activity_duration) || 0;
          activityHours += hours;
          dayActivityHours += hours;
        }
      }
    });

    // Only add days with activities
    if (dayActivityCount > 0) {
      activitiesByDay[dayNumber] = {
        count: dayActivityCount,
        hours: dayActivityHours
      };
    }
  });

  if (activityCount === 0) {
    return null;
  }

  const hasDayDurations = day_durations && Object.keys(day_durations).length > 0;

  return (
    <div className="mb-4 px-3 py-2 bg-blue-900/20 border border-blue-800 rounded-md text-sm">
      <div className="flex items-center justify-between mb-1">
        <span>
          <span className="font-semibold text-blue-300">{activityCount}</span>
          <span className="text-blue-100"> {activityCount === 1 ? 'activity' : 'activities'} selected</span>
        </span>
        {activityHours > 0 && (
          <span className="text-blue-200 flex items-center">
            <HiOutlineClock className="mr-1" /> {activityHours.toFixed(1)} hours total
          </span>
        )}
      </div>

      {/* Per-day activity breakdown */}
      {Object.keys(activitiesByDay).length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 text-xs">
          {Object.entries(activitiesByDay).map(([dayNumber, data]) => (
            <div key={dayNumber} className="bg-blue-900/30 rounded px-2 py-1 flex items-center justify-between">
              <span>Day {dayNumber}: {data.count} {data.count === 1 ? 'activity' : 'activities'}</span>
              <span className="flex items-center text-blue-200">
                <HiOutlineClock className="mr-1" size={12} />
                {hasDayDurations
                  ? day_durations![dayNumber].toFixed(1)
                  : data.hours.toFixed(1)
                }h
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;