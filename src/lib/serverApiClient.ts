import { makeAuthenticatedRequest } from './googleAuth';

// Get the production API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://actota-api-88694943961.us-central1.run.app';

/**
 * Server-side API client for making requests to ACTOTA API
 * Uses authentication for production, direct calls for localhost
 * This should only be used in server-side code (API routes, server components, etc.)
 */
export class ServerApiClient {
  private baseUrl: string;
  private isLocalhost: boolean;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
    this.isLocalhost = this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1');
  }

  /**
   * Make a GET request to the API
   */
  async get(endpoint: string, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Try direct request first (for services that allow allUsers)
    try {
      return await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
    } catch (error) {
      // If direct request fails and we're not on localhost, try authenticated request
      if (!this.isLocalhost) {
        console.log('Direct request failed, trying authenticated request...');
        return makeAuthenticatedRequest(url, {
          method: 'GET',
          ...options,
        });
      }
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   */
  async post(endpoint: string, data?: any, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.isLocalhost) {
      // Direct fetch for localhost (no authentication needed)
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
    }
    
    // Use authenticated request for production
    return makeAuthenticatedRequest(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * Make a PUT request to the API
   */
  async put(endpoint: string, data?: any, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.isLocalhost) {
      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
    }
    
    return makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * Make a PATCH request to the API
   */
  async patch(endpoint: string, data?: any, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.isLocalhost) {
      return fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
    }
    
    return makeAuthenticatedRequest(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * Make a DELETE request to the API
   */
  async delete(endpoint: string, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (this.isLocalhost) {
      return fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
    }
    
    return makeAuthenticatedRequest(url, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Export a default instance
export const serverApiClient = new ServerApiClient();

// Helper functions for common API operations
export const serverApi = {
  // User operations
  getUser: (id: string) => serverApiClient.get(`/users/${id}`),
  updateUser: (id: string, data: any) => serverApiClient.put(`/users/${id}`, data),
  
  // Itinerary operations
  getItineraries: () => serverApiClient.get('/itineraries'),
  getItinerary: (id: string) => serverApiClient.get(`/itineraries/${id}`),
  createItinerary: (data: any) => serverApiClient.post('/itineraries', data),
  updateItinerary: (id: string, data: any) => serverApiClient.put(`/itineraries/${id}`, data),
  deleteItinerary: (id: string) => serverApiClient.delete(`/itineraries/${id}`),
  
  // Activity operations
  getActivities: () => serverApiClient.get('/activities'),
  getActivity: (id: string) => serverApiClient.get(`/activities/${id}`),
  
  // Health check
  health: () => serverApiClient.get('/health'),
};

