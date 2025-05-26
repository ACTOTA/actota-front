'use client';

import React from 'react';
import { HiOutlineSearch, HiOutlineClock } from 'react-icons/hi';
import { BiSearchAlt, BiMap } from 'react-icons/bi';
import Input from '@/src/components/figma/Input';
import Button from '@/src/components/figma/Button';
import { Activity, ActiveSearchItem } from '../types';
import { extractObjectId, extractCompanyName } from '../utils';

interface ActivitySearchProps {
  dayNumber: string;
  itemIndex: number;
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

const ActivitySearch: React.FC<ActivitySearchProps> = ({
  dayNumber,
  itemIndex,
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
  const isActive = activeSearchItem?.dayNumber === dayNumber && activeSearchItem?.itemIndex === itemIndex;

  return (
    <div className="relative activity-search-container">
      <p className="text-primary-gray text-left mb-1 text-sm">Search Activities</p>
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <Input
            type="text"
            value={isActive ? activitySearchQuery : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setActivitySearchQuery(e.target.value);
              setActiveSearchItem({ dayNumber, itemIndex });
            }}
            icon={<HiOutlineSearch size={20} />}
            placeholder="Search activities by name, description, or location"
            onFocus={() => setActiveSearchItem({ dayNumber, itemIndex })}
          />

          {/* Activity Dropdown */}
          {isActive && (
            <div
              className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
              onBlur={() => setTimeout(() => setActiveSearchItem(null), 100)}
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
                filteredActivities.map((activity) => (
                  <div
                    key={typeof activity._id === 'string' ? activity._id : (activity._id && '$oid' in activity._id ? activity._id.$oid : Math.random().toString())}
                    className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    onClick={() => handleSelectActivity(activity, dayNumber, itemIndex)}
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
                      {activity.duration_minutes !== undefined && (
                        <span className="flex items-center">
                          <HiOutlineClock className="mr-1" />
                          {(activity.duration_minutes / 60).toFixed(1)}h
                        </span>
                      )}
                      {activity.company && (
                        <span>Provider: {activity.company}</span>
                      )}
                    </div>
                  </div>
                ))
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
              setActiveSearchItem({ dayNumber, itemIndex });
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
  );
};

export default ActivitySearch;