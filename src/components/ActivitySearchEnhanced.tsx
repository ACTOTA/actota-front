import React, { useState, useEffect } from 'react';
import { ACTIVITY_CATEGORIES, matchActivityToCategories } from '@/src/utils/activityTagMapping';

interface ActivitySearchEnhancedProps {
  activities: any[];
  onActivitySelect: (activity: any) => void;
}

/**
 * Enhanced activity search component that shows how general searches
 * map to specific activities using the tag system
 */
export default function ActivitySearchEnhanced({ 
  activities, 
  onActivitySelect 
}: ActivitySearchEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [matchedActivities, setMatchedActivities] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Match activities based on search query or selected category
  useEffect(() => {
    if (!searchQuery && !selectedCategory) {
      setMatchedActivities([]);
      return;
    }

    const matched = activities.filter(activity => {
      // If category is selected, check if activity matches
      if (selectedCategory) {
        const categories = matchActivityToCategories(
          activity.title || activity.name,
          activity.tags || []
        );
        if (categories.includes(selectedCategory)) return true;
      }

      // Check if search query matches
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const nameMatch = (activity.title || activity.name || '').toLowerCase().includes(lowerQuery);
        const tagMatch = (activity.tags || []).some((tag: string) => 
          tag.toLowerCase().includes(lowerQuery)
        );
        return nameMatch || tagMatch;
      }

      return false;
    });

    setMatchedActivities(matched.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, selectedCategory, activities]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for activities (e.g., 'hiking', 'water sports', 'adventure')"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ACTIVITY_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id === selectedCategory ? null : category.id);
              setShowSuggestions(true);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {showSuggestions && matchedActivities.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-sm text-gray-500 mb-2">
              Found {matchedActivities.length} matching activities:
            </p>
            {matchedActivities.map((activity, index) => (
              <div
                key={activity._id || index}
                onClick={() => {
                  onActivitySelect(activity);
                  setShowSuggestions(false);
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg mb-1 last:mb-0"
              >
                <h4 className="font-medium text-gray-900">
                  {activity.title || activity.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description?.substring(0, 100)}...
                </p>
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activity.tags.slice(0, 5).map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {activity.tags.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{activity.tags.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchQuery && matchedActivities.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border p-4">
          <p className="text-gray-500 text-center">
            No activities found matching "{searchQuery}"
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Try searching for general categories like "hiking" or "adventure"
          </p>
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}