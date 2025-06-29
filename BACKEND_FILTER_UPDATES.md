# Backend Route Updates for Enhanced Itinerary Filtering

## Overview
The itinerary filtering system has been updated with new filter categories and Vertex AI integration for activity discovery. The following backend changes are required.

## New API Route Required

### GET `/api/activities/search`
**Purpose**: Get available activities using Vertex AI search capabilities
**Query Parameters**: None (initial implementation)
**Response Format**:
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "hiking_123",
        "name": "Mountain Hiking",
        "category": "hiking",
        "tags": ["outdoor", "fitness", "nature"],
        "description": "Scenic mountain trails with varying difficulty levels",
        "location_types": ["mountain", "forest", "national_park"],
        "popularity_score": 85
      },
      {
        "id": "rafting_456", 
        "name": "White Water Rafting",
        "category": "water-sports",
        "tags": ["adventure", "adrenaline", "team"],
        "description": "Thrilling rapids experience for all skill levels",
        "location_types": ["river", "canyon"],
        "popularity_score": 92
      }
    ]
  }
}
```

**Implementation Notes**:
- Use Vertex AI Search to query available activities from your activity database
- Return activities sorted by popularity score
- Include category mapping based on `ACTIVITY_CATEGORIES` from frontend
- Cache results for 1 hour to reduce API calls

## Updated Itinerary Search Route

### Enhanced GET `/api/itineraries/search`
**New Query Parameters to Support**:
- `themes[]`: Array of theme IDs (adventure, relaxation, culture, nature, culinary, winter)
- `activity_types[]`: Array of activity type IDs from ACTIVITY_CATEGORIES
- `group_size`: Single group size category (solo, couple, family, group)
- `trip_duration`: Single duration category (weekend, week, extended)
- `budget_max`: Maximum budget amount (existing, keep)
- `budget_enabled`: Whether budget filtering is enabled (existing, keep)

**Updated Search Logic**:
```javascript
// Example search implementation
async function searchItineraries(filters) {
  let query = {};
  
  // Theme filtering
  if (filters.themes && filters.themes.length > 0) {
    query.$or = [
      { themes: { $in: filters.themes } },
      { tags: { $in: filters.themes } },
      { 'activities.tags': { $in: filters.themes } }
    ];
  }
  
  // Activity type filtering using tag mapping
  if (filters.activity_types && filters.activity_types.length > 0) {
    const activityTags = mapActivityTypesToTags(filters.activity_types);
    query['activities.tags'] = { $in: activityTags };
  }
  
  // Group size filtering
  if (filters.group_size) {
    switch (filters.group_size) {
      case 'solo':
        query.min_guests = { $lte: 1 };
        query.max_guests = { $gte: 1 };
        break;
      case 'couple':
        query.min_guests = { $lte: 2 };
        query.max_guests = { $gte: 2 };
        break;
      case 'family':
        query.min_guests = { $lte: 6 };
        query.max_guests = { $gte: 3 };
        break;
      case 'group':
        query.max_guests = { $gte: 7 };
        break;
    }
  }
  
  // Duration filtering
  if (filters.trip_duration) {
    switch (filters.trip_duration) {
      case 'weekend':
        query.length_days = { $gte: 2, $lte: 3 };
        break;
      case 'week':
        query.length_days = { $gte: 4, $lte: 7 };
        break;
      case 'extended':
        query.length_days = { $gte: 8 };
        break;
    }
  }
  
  // Budget filtering (existing logic)
  if (filters.budget_enabled && filters.budget_max) {
    query.person_cost = { $lte: filters.budget_max };
  }
  
  return await ItineraryModel.find(query).sort({ popularity_score: -1 });
}
```

## Database Schema Updates

### Itineraries Collection - New Fields:
```javascript
{
  // Existing fields...
  
  // New theme classification
  themes: ["adventure", "nature"], // Array of theme IDs
  
  // Enhanced activity structure
  activities: [
    {
      name: "Mountain Hiking",
      type: "hiking", // Maps to ACTIVITY_CATEGORIES
      tags: ["outdoor", "fitness", "nature"],
      duration_hours: 4,
      difficulty_level: "moderate",
      // ... existing activity fields
    }
  ],
  
  // Enhanced metadata for filtering
  trip_characteristics: {
    pace: "moderate", // relaxed, moderate, active
    accessibility: "standard", // accessible, standard, challenging
    group_dynamics: ["family-friendly", "couples", "solo-travel"],
    best_months: [5, 6, 7, 8, 9], // Month numbers for seasonal filtering
  },
  
  // Search optimization
  search_tags: ["hiking", "nature", "mountain", "outdoor"], // Flattened tags for search
  popularity_score: 85, // 0-100 score for sorting
  
  // Updated timestamps
  last_updated: Date,
  tags_updated: Date
}
```

### New Collection: activity_templates
```javascript
{
  _id: ObjectId,
  name: "Mountain Hiking",
  category: "hiking", // Maps to frontend ACTIVITY_CATEGORIES
  tags: ["outdoor", "fitness", "nature", "scenic"],
  description: "Scenic mountain trails with varying difficulty levels",
  typical_duration: { min: 2, max: 8 }, // hours
  difficulty_levels: ["easy", "moderate", "challenging"],
  equipment_needed: ["hiking_boots", "water", "snacks"],
  location_types: ["mountain", "forest", "national_park"],
  seasonal_availability: [4, 5, 6, 7, 8, 9, 10], // months
  popularity_score: 85,
  created_at: Date,
  updated_at: Date
}
```

## Activity Type Mapping Function

Create a server-side utility to map frontend activity categories to database tags:

```javascript
// utils/activityMapping.js
const ACTIVITY_CATEGORY_TAGS = {
  'hiking': ['hiking', 'trails', 'trekking', 'walking', 'nature-walks', 'outdoor'],
  'mountain-biking': ['mountain-biking', 'biking', 'cycling', 'mtb', 'outdoor-sports'],
  'water-sports': ['water-sports', 'rafting', 'paddleboarding', 'kayaking', 'swimming'],
  'adventure': ['adventure', 'extreme-sports', 'adrenaline', 'thrill-seeking'],
  'wildlife': ['wildlife', 'nature', 'animals', 'bird-watching', 'safari'],
  'cultural': ['cultural', 'museums', 'tours', 'historical', 'educational'],
  'relaxation': ['relaxation', 'spa', 'wellness', 'hot-springs', 'peaceful'],
  'winter-sports': ['winter-sports', 'skiing', 'snowboarding', 'snow-activities'],
  'motorized': ['motorized', 'atv', 'utv', 'snowmobile', 'off-road'],
  'dining': ['dining', 'culinary', 'food', 'chef', 'tasting']
};

function mapActivityTypesToTags(activityTypes) {
  const tags = new Set();
  activityTypes.forEach(type => {
    const categoryTags = ACTIVITY_CATEGORY_TAGS[type];
    if (categoryTags) {
      categoryTags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
}

module.exports = { mapActivityTypesToTags, ACTIVITY_CATEGORY_TAGS };
```

## Vertex AI Integration

### Activity Search Implementation:
```javascript
// services/vertexAISearch.js
const { VertexAI } = require('@google-cloud/vertexai');

class ActivitySearchService {
  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION
    });
  }
  
  async searchActivities(query = '', filters = {}) {
    try {
      // Use Vertex AI to search activity database
      const searchRequest = {
        query: query || 'popular outdoor activities',
        filters: {
          category: filters.category,
          location_type: filters.location_type,
          difficulty: filters.difficulty
        },
        limit: 50,
        include_metadata: true
      };
      
      const results = await this.vertexAI.search(searchRequest);
      
      // Transform results to match expected format
      return results.map(result => ({
        id: result.id,
        name: result.name,
        category: result.metadata.category,
        tags: result.metadata.tags || [],
        description: result.snippet,
        popularity_score: result.score * 100
      }));
      
    } catch (error) {
      console.error('Vertex AI search error:', error);
      // Fallback to database search
      return await this.fallbackActivitySearch(query, filters);
    }
  }
  
  async fallbackActivitySearch(query, filters) {
    // Direct database query as fallback
    const ActivityTemplate = require('../models/ActivityTemplate');
    return await ActivityTemplate.find({
      $text: { $search: query }
    }).limit(50).sort({ popularity_score: -1 });
  }
}

module.exports = new ActivitySearchService();
```

## Migration Script

Create a migration to update existing itineraries with new fields:

```javascript
// migrations/addFilteringFields.js
async function migrateItineraries() {
  const itineraries = await ItineraryModel.find({});
  
  for (const itinerary of itineraries) {
    const updates = {
      themes: inferThemesFromActivities(itinerary.activities),
      search_tags: generateSearchTags(itinerary),
      popularity_score: calculatePopularityScore(itinerary),
      trip_characteristics: {
        pace: inferPaceFromActivities(itinerary.activities),
        accessibility: 'standard',
        group_dynamics: inferGroupDynamics(itinerary),
        best_months: inferBestMonths(itinerary.location)
      }
    };
    
    await ItineraryModel.updateOne(
      { _id: itinerary._id },
      { $set: updates }
    );
  }
}
```

## Performance Considerations

1. **Indexing**: Create compound indexes for common filter combinations:
   ```javascript
   db.itineraries.createIndex({ themes: 1, person_cost: 1, length_days: 1 });
   db.itineraries.createIndex({ search_tags: 1, popularity_score: -1 });
   db.itineraries.createIndex({ "activities.tags": 1, max_guests: 1 });
   ```

2. **Caching**: Implement Redis caching for:
   - Activity search results (1 hour TTL)
   - Popular filter combinations (30 minutes TTL)
   - Theme-based itinerary lists (15 minutes TTL)

3. **Rate Limiting**: Add rate limiting to Vertex AI search endpoint to manage costs

## Testing

1. Test new filter combinations work correctly
2. Verify Vertex AI integration returns relevant activities
3. Test fallback behavior when Vertex AI is unavailable
4. Performance test with large datasets
5. Test filter combination edge cases