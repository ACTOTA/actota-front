'use client';

import React, { useState } from 'react';
import { HiOutlineSearch, HiOutlineClock, HiX, HiPlus } from 'react-icons/hi';
import { BiSearchAlt, BiMap } from 'react-icons/bi';
import Input from '@/src/components/figma/Input';
import Button from '@/src/components/figma/Button';
import { Activity, ActiveSearchItem, DayItem } from '../types';
import { extractObjectId, extractCompanyName } from '../utils';
import ActivityDetails from './ActivityDetails';

interface DayActivitiesSearchProps {
  dayNumber: string;
  dayItems: DayItem[];
  activitySearchQuery: string;
  activeSearchItem: ActiveSearchItem | null;
  isLoadingActivities: boolean;
  filteredActivities: Activity[];
  activities: Activity[];
  setActivitySearchQuery: (query: string) => void;
  setActiveSearchItem: (item: ActiveSearchItem | null) => void;
  fetchActivities: () => void;
  handleSelectActivity: (activity: Activity, dayNumber: string, itemIndex: number) => void;
  handleAddDayItem: (dayNumber: string, type: 'transportation' | 'activity' | 'accommodation') => void;
  handleRemoveDayItem: (dayNumber: string, itemIndex: number) => void;
  handleDayItemChange: (dayNumber: string, itemIndex: number, field: string, value: string) => void;
}

const DayActivitiesSearch: React.FC<DayActivitiesSearchProps> = ({
  dayNumber,
  dayItems,
  activitySearchQuery,
  activeSearchItem,
  isLoadingActivities,
  filteredActivities,
  activities,
  setActivitySearchQuery,
  setActiveSearchItem,
  fetchActivities,
  handleSelectActivity,
  handleAddDayItem,
  handleRemoveDayItem,
  handleDayItemChange,
}) => {
  // Get only activities from the day items
  const activityItems = dayItems.filter(item => item.type === 'activity');
  const isActive = activeSearchItem?.dayNumber === dayNumber;
  const [newItemIndex, setNewItemIndex] = useState<number | null>(null);

  const handleAddActivity = () => {
    // Add a new activity to this day
    handleAddDayItem(dayNumber, 'activity');
    
    // Determine the index of the newly added activity
    // It will be the current length of activity items
    setNewItemIndex(dayItems.length);
    
    // Focus on search right away
    setActiveSearchItem({ dayNumber, itemIndex: dayItems.length });
    setActivitySearchQuery('');
    fetchActivities();
  };

  return (
    <div className="border border-gray-700 p-4 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-3">
        <h6 className="text-md font-medium flex items-center">
          <span className="text-blue-300">Activities</span>
        </h6>
        <Button
          type="button"
          onClick={handleAddActivity}
          variant="secondary"
          size="sm"
          className="flex items-center"
        >
          <HiPlus className="mr-1" /> Add Activity
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative activity-search-container mb-4">
        <p className="text-primary-gray text-left mb-1 text-sm">Search Activities</p>
        <div className="flex gap-2">
          <div className="flex-grow relative">
            <Input
              type="text"
              value={isActive ? activitySearchQuery : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setActivitySearchQuery(e.target.value);
                setActiveSearchItem({ dayNumber, itemIndex: -1 }); // -1 indicates day-level search
              }}
              icon={<HiOutlineSearch size={20} />}
              placeholder="Search activities to add to this day"
              onFocus={() => {
                setActiveSearchItem({ dayNumber, itemIndex: -1 });
                fetchActivities();
              }}
            />

            {/* Activity Dropdown */}
            {isActive && (
              <div
                className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {isLoadingActivities ? (
                  <div className="p-3 text-center text-gray-400">
                    <div className="animate-spin mx-auto h-5 w-5 border-2 border-gray-500 rounded-full border-t-white mb-1"></div>
                    <p>Loading activities...</p>
                  </div>
                ) : !Array.isArray(filteredActivities) || filteredActivities.length === 0 ? (
                  <div className="p-3 text-center text-gray-400">
                    {!Array.isArray(activities) || activities.length === 0 ? (
                      <div>
                        <p className="mb-1">No activities available.</p>
                        <p className="text-xs">Please verify the API is running at <span className="text-blue-400">http://localhost:8080/api/activities</span></p>
                        <button
                          className="mt-2 px-3 py-1 bg-blue-900/30 border border-blue-800 rounded-md text-xs hover:bg-blue-900/50"
                          onClick={() => fetchActivities()}
                        >
                          Retry Connection
                        </button>
                      </div>
                    ) : (
                      <p>No matching activities found. Try a different search term.</p>
                    )}
                  </div>
                ) : (
                  // Only render map if we have a valid array
                  filteredActivities.map((activity) => {
                    // Find the first empty activity slot in this day to use for this activity
                    const emptyActivityIndex = dayItems.findIndex(
                      (item, idx) => item.type === 'activity' && !(item as any).activity_id
                    );
                    
                    // Use either the found empty slot or the latest added one
                    const targetIndex = emptyActivityIndex !== -1 
                      ? emptyActivityIndex 
                      : (newItemIndex !== null ? newItemIndex : -1);
                      
                    return (
                      <div
                        key={typeof activity._id === 'string' ? activity._id : (activity._id && '$oid' in activity._id ? activity._id.$oid : Math.random().toString())}
                        className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                        onClick={() => {
                          if (targetIndex !== -1) {
                            handleSelectActivity(activity, dayNumber, targetIndex);
                            setNewItemIndex(null);
                          } else {
                            // If no slot available, create a new one first
                            handleAddDayItem(dayNumber, 'activity');
                            // Then select in the next render cycle
                            setTimeout(() => {
                              const newIdx = dayItems.length;
                              handleSelectActivity(activity, dayNumber, newIdx);
                              setNewItemIndex(null);
                            }, 10);
                          }
                        }}
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{activity.title || 'Unnamed Activity'}</span>
                          {activity.duration_minutes !== undefined && (
                            <span className="bg-blue-900/40 px-2 py-0.5 ml-2 rounded text-xs text-blue-200 flex items-center">
                              <HiOutlineClock className="mr-1" />
                              {(activity.duration_minutes / 60).toFixed(1)}h
                            </span>
                          )}
                        </div>
                        {/* Location from address or legacy location field */}
                        {(activity.address?.city || activity.location) && (
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <BiMap className="mr-1" />
                            {activity.address?.city
                              ? [activity.address.city, activity.address.state].filter(Boolean).join(', ')
                              : activity.location}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-x-3 text-xs text-gray-400 mt-1">
                          {activity.price_per_person !== undefined && (
                            <span>${activity.price_per_person}</span>
                          )}
                          {activity.company && (
                            <span>Provider: {activity.company}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => {
              if (isActive) {
                setActiveSearchItem(null);
              } else {
                setActiveSearchItem({ dayNumber, itemIndex: -1 });
                fetchActivities();
              }
            }}
            variant="secondary"
            size="sm"
          >
            <BiSearchAlt size={20} />
          </Button>
        </div>
      </div>

      {/* Selected Activities List */}
      {activityItems.length > 0 ? (
        <div className="space-y-2 mt-4">
          <p className="text-primary-gray text-left mb-1 text-sm">Selected Activities:</p>
          
          {activityItems.map((item, idx) => {
            // Find the original index in the full day items array
            const originalIndex = dayItems.findIndex((di, i) => 
              di.type === 'activity' && i >= idx && di === item
            );
            
            return (
              <div key={idx} className="flex items-start justify-between p-2 bg-gray-800/40 rounded-md border border-gray-700">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      <HiOutlineClock className={`mr-1 ${(item as any).available_time_slots ? 'text-green-400' : 'text-gray-400'}`} />
                      <select
                        value={item.time}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDayItemChange(dayNumber, originalIndex, 'time', e.target.value)}
                        className="bg-gray-800 border-none focus:ring-0 text-white text-sm py-1 px-2 rounded-md"
                      >
                        {/* Show time slots from activity.available_time_slots if available */}
                        {(() => {
                          // Import isTimeConflicting function
                          const { isTimeConflicting } = require('../utils');
                          
                          if ((item as any).available_time_slots) {
                            try {
                              const timeSlots = JSON.parse((item as any).available_time_slots);

                              // Filter out null or undefined values and ensure strings
                              return timeSlots
                                .filter((timeSlot: string | null | undefined) => timeSlot && typeof timeSlot === 'string')
                                .map((timeSlot: string) => {
                                  try {
                                    // Parse hour and minute for display, handle both HH:MM and HH:MM:SS formats
                                    const parts = timeSlot.split(':');
                                    const hour = Number(parts[0]);
                                    const minute = Number(parts[1]);

                                    // Check if both hour and minute are valid numbers
                                    if (isNaN(hour) || isNaN(minute)) {
                                      console.warn(`Invalid time format: ${timeSlot}`);
                                      return null;
                                    }

                                    // Format for 12-hour clock display
                                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                    const amPm = hour >= 12 ? 'PM' : 'AM';
                                    
                                    // Check if this time conflicts with other activities
                                    const normalizedTimeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                    const isConflicting = isTimeConflicting(normalizedTimeSlot, dayItems, originalIndex);

                                    return (
                                      <option 
                                        key={timeSlot} 
                                        value={timeSlot}
                                        disabled={isConflicting}
                                        className={isConflicting ? 'text-gray-500' : ''}
                                      >
                                        {`${displayHour}:${minute.toString().padStart(2, '0')} ${amPm}`}
                                        {isConflicting ? ' (Conflicts)' : ''}
                                      </option>
                                    );
                                  } catch (err) {
                                    console.warn(`Error parsing time slot: ${timeSlot}`, err);
                                    return null;
                                  }
                                })
                                .filter(Boolean); // Remove any null results from failed parses
                            } catch (error) {
                              console.error('Error parsing time slots:', error);
                              // Fallback to standard slots if parsing fails
                              return defaultTimeOptions();
                            }
                          } else {
                            // No available_time_slots, use standard options
                            return defaultTimeOptions();
                          }

                          // Helper function for default time options
                          function defaultTimeOptions() {
                            return Array.from({ length: 24 }).flatMap((_, hour) => {
                              const times = ['00', '30'];
                              return times.map(minute => {
                                const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                const amPm = hour >= 12 ? 'PM' : 'AM';
                                
                                // Check if this time conflicts with other activities
                                const isConflicting = isTimeConflicting(timeValue, dayItems, originalIndex);
                                
                                return (
                                  <option 
                                    key={timeValue} 
                                    value={timeValue}
                                    disabled={isConflicting}
                                    className={isConflicting ? 'text-gray-500' : ''}
                                  >
                                    {`${displayHour}:${minute} ${amPm}`}
                                    {isConflicting ? ' (Conflicts)' : ''}
                                  </option>
                                );
                              });
                            });
                          }
                        })()}
                      </select>
                    </div>
                    {(item as any).activity_id ? (
                      <>
                        <ActivityDetails item={item} />
                        {/* Indicator for time slot availability */}
                        {(item as any).available_time_slots && (
                          <div className="mt-1 text-xs text-green-500 flex items-center">
                            <HiOutlineClock className="mr-1" />
                            <span>Using activity's available time slots</span>
                          </div>
                        )}
                        {/* Debug info to check if duration exists */}
                        {!(item as any).activity_duration && (
                          <div className="mt-1 text-xs text-yellow-500">
                            Note: Activity duration not available
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No activity selected</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDayItem(dayNumber, originalIndex)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <HiX size={18} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 italic text-center py-3 border border-gray-800 rounded-md">
          No activities added to this day yet
        </div>
      )}
    </div>
  );
};

export default DayActivitiesSearch;
