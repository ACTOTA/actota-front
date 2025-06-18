import { makeAuthenticatedRequest } from './googleAuth';

// Get the production API URL
const API_BASE_URL = process.env.ACTOTA_API_URL || 'https://api.actota.com';

/**
 * Server-side API client for making authenticated requests to ACTOTA API
 * This should only be used in server-side code (API routes, server components, etc.)
 */
export class ServerApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Make a GET request to the API
   */
  async get(endpoint: string, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    return makeAuthenticatedRequest(url, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request to the API
   */
  async post(endpoint: string, data?: any, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
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
  getUser: (id: string) => serverApiClient.get(`/api/users/${id}`),
  updateUser: (id: string, data: any) => serverApiClient.put(`/api/users/${id}`, data),
  
  // Itinerary operations
  getItineraries: () => serverApiClient.get('/api/itineraries'),
  getItinerary: (id: string) => serverApiClient.get(`/api/itineraries/${id}`),
  createItinerary: (data: any) => serverApiClient.post('/api/itineraries', data),
  updateItinerary: (id: string, data: any) => serverApiClient.put(`/api/itineraries/${id}`, data),
  deleteItinerary: (id: string) => serverApiClient.delete(`/api/itineraries/${id}`),
  
  // Activity operations
  getActivities: () => serverApiClient.get('/api/activities'),
  getActivity: (id: string) => serverApiClient.get(`/api/activities/${id}`),
  
  // Health check
  health: () => serverApiClient.get('/api/health'),
};

