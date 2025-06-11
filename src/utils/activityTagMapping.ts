// Activity Tag Mapping System
// Maps general activity categories to related tags for better search matching

export interface ActivityCategory {
  id: string;
  label: string;
  // Tags that activities in this category might have
  relatedTags: string[];
  // Keywords to help match specific activity names
  keywords: string[];
  // Icon reference (optional)
  icon?: string;
}

// General activity categories that users see in the search bar
export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'hiking',
    label: 'Hiking',
    relatedTags: ['hiking', 'trails', 'trekking', 'walking', 'nature-walks', 'outdoor'],
    keywords: ['hike', 'trail', 'trek', 'walk', 'path', 'summit', 'peak', 'mountain'],
  },
  {
    id: 'mountain-biking',
    label: 'Mountain Biking',
    relatedTags: ['mountain-biking', 'biking', 'cycling', 'mtb', 'outdoor-sports'],
    keywords: ['bike', 'biking', 'cycling', 'mtb', 'trail', 'downhill', 'cross-country'],
  },
  {
    id: 'water-sports',
    label: 'Water Sports',
    relatedTags: ['water-sports', 'rafting', 'paddleboarding', 'kayaking', 'swimming'],
    keywords: ['raft', 'paddle', 'kayak', 'swim', 'water', 'river', 'lake', 'whitewater'],
  },
  {
    id: 'adventure',
    label: 'Adventure',
    relatedTags: ['adventure', 'extreme-sports', 'adrenaline', 'thrill-seeking'],
    keywords: ['zipline', 'zip', 'ropes', 'climbing', 'rappel', 'bungee', 'extreme'],
  },
  {
    id: 'wildlife',
    label: 'Wildlife & Nature',
    relatedTags: ['wildlife', 'nature', 'animals', 'bird-watching', 'safari'],
    keywords: ['animal', 'wildlife', 'bird', 'nature', 'safari', 'viewing', 'watching'],
  },
  {
    id: 'cultural',
    label: 'Cultural',
    relatedTags: ['cultural', 'museums', 'tours', 'historical', 'educational'],
    keywords: ['museum', 'tour', 'history', 'culture', 'art', 'heritage', 'local'],
  },
  {
    id: 'relaxation',
    label: 'Relaxation',
    relatedTags: ['relaxation', 'spa', 'wellness', 'hot-springs', 'peaceful'],
    keywords: ['spa', 'hot spring', 'relax', 'massage', 'wellness', 'peaceful', 'calm'],
  },
  {
    id: 'winter-sports',
    label: 'Winter Sports',
    relatedTags: ['winter-sports', 'skiing', 'snowboarding', 'snow-activities'],
    keywords: ['ski', 'snowboard', 'snow', 'winter', 'slope', 'powder', 'alpine'],
  },
  {
    id: 'motorized',
    label: 'Motorized Adventures',
    relatedTags: ['motorized', 'atv', 'utv', 'snowmobile', 'off-road'],
    keywords: ['atv', 'utv', 'snowmobile', 'motor', 'drive', 'off-road', '4x4'],
  },
  {
    id: 'dining',
    label: 'Dining Experiences',
    relatedTags: ['dining', 'culinary', 'food', 'chef', 'tasting'],
    keywords: ['chef', 'dining', 'food', 'meal', 'restaurant', 'culinary', 'taste'],
  }
];

// Map specific activity types to their general categories and tags
export const ACTIVITY_TYPE_MAPPING: Record<string, string[]> = {
  // Current activity types from the UI
  'ATVing': ['motorized', 'adventure', 'outdoor'],
  'Backpacking': ['hiking', 'camping', 'outdoor', 'multi-day'],
  'Camping': ['camping', 'outdoor', 'nature', 'overnight'],
  'Campfire': ['camping', 'relaxation', 'evening', 'social'],
  'Cave Exploring': ['adventure', 'underground', 'spelunking', 'exploration'],
  'Fishing': ['fishing', 'water-sports', 'relaxation', 'outdoor'],
  'Fly Over the Rockies': ['scenic', 'aerial', 'sightseeing', 'unique'],
  'Gold Mine Tours': ['cultural', 'historical', 'educational', 'tours'],
  'Hiking': ['hiking', 'outdoor', 'fitness', 'nature'],
  'Hot Springs': ['relaxation', 'wellness', 'water', 'natural'],
  'Horseback Riding': ['animals', 'outdoor', 'scenic', 'western'],
  'Mountain Biking': ['mountain-biking', 'outdoor', 'fitness', 'adventure'],
  'Museum Tours': ['cultural', 'educational', 'indoor', 'historical'],
  'Paddle Boarding': ['water-sports', 'fitness', 'lake', 'summer'],
  'Private Chef': ['dining', 'luxury', 'culinary', 'exclusive'],
  'Ropes Course': ['adventure', 'climbing', 'challenge', 'team-building'],
  'Sight Seeing': ['scenic', 'tours', 'photography', 'relaxation'],
  'Train Riding': ['scenic', 'transportation', 'historical', 'relaxation'],
  'White Water Rafting': ['water-sports', 'adventure', 'team', 'adrenaline'],
  'Ziplining': ['adventure', 'aerial', 'adrenaline', 'scenic'],
  'Skiing': ['winter-sports', 'outdoor', 'fitness', 'snow'],
  'Snowmobiling': ['winter-sports', 'motorized', 'adventure', 'snow'],
  'Snowshoeing': ['winter-sports', 'hiking', 'outdoor', 'peaceful'],
};

/**
 * Get related tags for a general activity category
 */
export function getTagsForCategory(categoryId: string): string[] {
  const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.relatedTags : [];
}

/**
 * Get keywords for a general activity category
 */
export function getKeywordsForCategory(categoryId: string): string[] {
  const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.keywords : [];
}

/**
 * Match a specific activity to general categories based on its name and tags
 */
export function matchActivityToCategories(
  activityName: string, 
  activityTags: string[] = []
): string[] {
  const matchedCategories = new Set<string>();
  const lowerName = activityName.toLowerCase();
  const lowerTags = activityTags.map(tag => tag.toLowerCase());

  ACTIVITY_CATEGORIES.forEach(category => {
    // Check if any keywords match the activity name
    const keywordMatch = category.keywords.some(keyword => 
      lowerName.includes(keyword.toLowerCase())
    );

    // Check if any related tags match the activity tags
    const tagMatch = category.relatedTags.some(relatedTag =>
      lowerTags.includes(relatedTag.toLowerCase())
    );

    if (keywordMatch || tagMatch) {
      matchedCategories.add(category.id);
    }
  });

  return Array.from(matchedCategories);
}

/**
 * Enhanced search function that uses both exact matching and tag-based matching
 */
export function searchActivitiesByCategories(
  activities: any[],
  selectedCategories: string[]
): any[] {
  if (!selectedCategories || selectedCategories.length === 0) {
    return activities;
  }

  // Get all related tags for selected categories
  const searchTags = new Set<string>();
  const searchKeywords = new Set<string>();

  selectedCategories.forEach(categoryId => {
    getTagsForCategory(categoryId).forEach(tag => searchTags.add(tag.toLowerCase()));
    getKeywordsForCategory(categoryId).forEach(keyword => searchKeywords.add(keyword.toLowerCase()));
  });

  // Filter activities
  return activities.filter(activity => {
    const activityName = (activity.title || activity.name || '').toLowerCase();
    const activityTags = (activity.tags || []).map((tag: string) => tag.toLowerCase());
    const activityTypes = (activity.activity_types || []).map((type: string) => type.toLowerCase());

    // Check direct tag matches
    const hasMatchingTag = activityTags.some(tag => searchTags.has(tag));
    
    // Check activity type matches
    const hasMatchingType = activityTypes.some(type => searchTags.has(type));
    
    // Check keyword matches in name
    const hasKeywordMatch = Array.from(searchKeywords).some(keyword => 
      activityName.includes(keyword)
    );

    return hasMatchingTag || hasMatchingType || hasKeywordMatch;
  });
}

/**
 * Convert user-selected activity types to search parameters
 */
export function convertActivitySelectionToSearchParams(selectedActivities: string[]): {
  categories: string[];
  tags: string[];
  pace?: string;
  transportation?: boolean;
} {
  const categories = new Set<string>();
  const tags = new Set<string>();
  let pace: string | undefined;
  let transportation: boolean | undefined;

  selectedActivities.forEach(activity => {
    // Check for pace selection
    if (activity.includes('Pace')) {
      const paceValue = activity.replace(' Pace', '').toLowerCase();
      pace = paceValue;
      return;
    }

    // Check for transportation
    if (activity === 'Transportation Included') {
      transportation = true;
      return;
    }

    // Check if it's a known activity type
    const mappedTags = ACTIVITY_TYPE_MAPPING[activity];
    if (mappedTags) {
      mappedTags.forEach(tag => tags.add(tag));
    }

    // Also check if it matches any category directly
    const category = ACTIVITY_CATEGORIES.find(cat => 
      cat.label.toLowerCase() === activity.toLowerCase()
    );
    if (category) {
      categories.add(category.id);
      category.relatedTags.forEach(tag => tags.add(tag));
    }
  });

  return {
    categories: Array.from(categories),
    tags: Array.from(tags),
    pace,
    transportation
  };
}