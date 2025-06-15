# AI Activity Classification Implementation Guide

This guide explains how to implement AI-powered activity classification on top of the existing tag system.

## Overview

The AI classification system enhances the tag-based search by:
1. Understanding semantic relationships between activities
2. Learning from user behavior and selections
3. Providing intelligent recommendations
4. Handling edge cases and fuzzy matches

## Implementation Approaches

### 1. Vector Embeddings Approach (Recommended)

This approach uses AI to convert activity names and descriptions into numerical vectors that capture semantic meaning.

```typescript
// Example implementation using OpenAI embeddings
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ActivityEmbedding {
  activityId: string;
  embedding: number[];
  metadata: {
    name: string;
    tags: string[];
    description?: string;
  };
}

// Generate embeddings for all activities (run once and cache)
async function generateActivityEmbeddings(activities: Activity[]): Promise<ActivityEmbedding[]> {
  const embeddings: ActivityEmbedding[] = [];
  
  for (const activity of activities) {
    // Create rich text representation of the activity
    const textRepresentation = `
      Activity: ${activity.title}
      Type: ${activity.activity_types.join(', ')}
      Tags: ${activity.tags.join(', ')}
      Description: ${activity.description}
    `.trim();
    
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: textRepresentation,
    });
    
    embeddings.push({
      activityId: activity._id,
      embedding: response.data[0].embedding,
      metadata: {
        name: activity.title,
        tags: activity.tags,
        description: activity.description,
      },
    });
  }
  
  return embeddings;
}

// Search activities using semantic similarity
async function searchActivitiesWithAI(
  query: string,
  activityEmbeddings: ActivityEmbedding[],
  topK: number = 10
): Promise<string[]> {
  // Generate embedding for search query
  const queryResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  
  const queryEmbedding = queryResponse.data[0].embedding;
  
  // Calculate cosine similarity with all activities
  const similarities = activityEmbeddings.map(activity => ({
    activityId: activity.activityId,
    similarity: cosineSimilarity(queryEmbedding, activity.embedding),
  }));
  
  // Sort by similarity and return top K
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(item => item.activityId);
}

// Helper function for cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### 2. Machine Learning Classification Approach

Train a classifier to predict activity categories based on activity features.

```typescript
// Using TensorFlow.js for client-side ML
import * as tf from '@tensorflow/tfjs';

interface ActivityFeatures {
  nameTokens: string[];
  duration: number;
  priceRange: 'low' | 'medium' | 'high';
  season: string[];
  difficulty: number;
}

class ActivityClassifier {
  private model: tf.LayersModel | null = null;
  private tokenizer: Map<string, number> = new Map();
  
  async loadModel(modelUrl: string) {
    this.model = await tf.loadLayersModel(modelUrl);
  }
  
  // Convert activity to feature vector
  private activityToFeatures(activity: Activity): number[] {
    const features: number[] = [];
    
    // Tokenize and encode activity name
    const tokens = this.tokenizeText(activity.title);
    const encoded = this.encodeTokens(tokens, 50); // Max 50 tokens
    features.push(...encoded);
    
    // Add numerical features
    features.push(activity.duration_minutes / 480); // Normalize to 0-1
    features.push(activity.price_per_person / 500); // Normalize
    
    // Add categorical features (one-hot encoded)
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    seasons.forEach(season => {
      features.push(activity.tags.includes(season) ? 1 : 0);
    });
    
    return features;
  }
  
  // Predict categories for an activity
  async predictCategories(activity: Activity): Promise<string[]> {
    if (!this.model) throw new Error('Model not loaded');
    
    const features = this.activityToFeatures(activity);
    const input = tf.tensor2d([features]);
    
    const predictions = this.model.predict(input) as tf.Tensor;
    const probabilities = await predictions.data();
    
    // Get top 3 categories with confidence > 0.3
    const categories = Array.from(probabilities)
      .map((prob, idx) => ({ category: this.indexToCategory(idx), probability: prob }))
      .filter(item => item.probability > 0.3)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3)
      .map(item => item.category);
    
    input.dispose();
    predictions.dispose();
    
    return categories;
  }
  
  private tokenizeText(text: string): string[] {
    return text.toLowerCase().split(/\s+/);
  }
  
  private encodeTokens(tokens: string[], maxLength: number): number[] {
    // Simple encoding - in production, use proper tokenizer
    const encoded = tokens.map(token => {
      if (!this.tokenizer.has(token)) {
        this.tokenizer.set(token, this.tokenizer.size + 1);
      }
      return this.tokenizer.get(token)!;
    });
    
    // Pad or truncate to maxLength
    if (encoded.length < maxLength) {
      return [...encoded, ...new Array(maxLength - encoded.length).fill(0)];
    }
    return encoded.slice(0, maxLength);
  }
  
  private indexToCategory(index: number): string {
    const categories = ['hiking', 'water-sports', 'adventure', 'cultural', 'relaxation'];
    return categories[index] || 'other';
  }
}
```

### 3. Hybrid Approach (Tag System + AI)

Combine the existing tag system with AI for best results:

```typescript
interface SearchResult {
  activityId: string;
  score: number;
  matchType: 'exact' | 'tag' | 'ai';
}

async function hybridActivitySearch(
  query: string,
  activities: Activity[],
  activityEmbeddings: ActivityEmbedding[]
): Promise<SearchResult[]> {
  const results = new Map<string, SearchResult>();
  
  // 1. Exact matches (highest priority)
  activities.forEach(activity => {
    if (activity.title.toLowerCase().includes(query.toLowerCase())) {
      results.set(activity._id, {
        activityId: activity._id,
        score: 1.0,
        matchType: 'exact',
      });
    }
  });
  
  // 2. Tag-based matches (from existing system)
  const { tags } = convertActivitySelectionToSearchParams([query]);
  activities.forEach(activity => {
    if (!results.has(activity._id)) {
      const tagMatch = activity.tags.some(tag => 
        tags.includes(tag.toLowerCase())
      );
      if (tagMatch) {
        results.set(activity._id, {
          activityId: activity._id,
          score: 0.8,
          matchType: 'tag',
        });
      }
    }
  });
  
  // 3. AI semantic matches (fill gaps)
  const aiMatches = await searchActivitiesWithAI(query, activityEmbeddings, 20);
  aiMatches.forEach((activityId, index) => {
    if (!results.has(activityId)) {
      results.set(activityId, {
        activityId,
        score: 0.6 * (1 - index / 20), // Decay score by rank
        matchType: 'ai',
      });
    }
  });
  
  // Sort by score and return
  return Array.from(results.values())
    .sort((a, b) => b.score - a.score);
}
```

## Implementation Steps

1. **Phase 1: Data Preparation**
   - Audit existing activities and their tags
   - Ensure all activities have comprehensive tags
   - Add missing metadata (descriptions, categories)

2. **Phase 2: Embedding Generation**
   - Set up OpenAI API or alternative embedding service
   - Generate embeddings for all activities
   - Store embeddings in database or vector store

3. **Phase 3: Search Integration**
   - Update search API to use hybrid approach
   - Add caching for performance
   - Implement fallback to tag-only search

4. **Phase 4: Learning & Optimization**
   - Track user selections after searches
   - Use feedback to improve embeddings
   - Fine-tune search weights

## Example API Integration

```typescript
// Update your search API route
export async function POST(request: NextRequest) {
  const searchParams = await request.json();
  
  // Use hybrid search for activities
  if (searchParams.activities?.length > 0) {
    const enhancedActivities = await hybridActivitySearch(
      searchParams.activities.join(' '),
      allActivities,
      cachedEmbeddings
    );
    
    // Add AI-matched activity IDs to search params
    searchParams.ai_activity_ids = enhancedActivities
      .filter(r => r.matchType === 'ai')
      .map(r => r.activityId);
  }
  
  // Continue with existing search logic...
}
```

## Performance Considerations

1. **Caching**: Cache embeddings and frequent search results
2. **Batch Processing**: Generate embeddings in batches
3. **Edge Computing**: Consider using edge functions for embeddings
4. **Fallback**: Always have tag-based search as fallback

## Cost Optimization

1. Use smaller embedding models for cost efficiency
2. Cache aggressively to reduce API calls
3. Consider self-hosted models for high volume
4. Implement rate limiting

## Monitoring & Improvement

1. Track search quality metrics:
   - Click-through rate on search results
   - Time to selection
   - Search refinements

2. A/B test different approaches:
   - Pure tags vs hybrid
   - Different embedding models
   - Various score weights

3. Continuously improve:
   - Add new tags based on AI insights
   - Update embeddings periodically
   - Refine scoring algorithms