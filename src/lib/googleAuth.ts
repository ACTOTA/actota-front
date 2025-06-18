import { GoogleAuth } from 'google-auth-library';

// Cache the auth client to avoid creating multiple instances
let authClient: any = null;

/**
 * Get authenticated Google Auth client for server-side requests
 * This should only be called on the server side (API routes, server components, etc.)
 */
export async function getGoogleAuthClient() {
  if (authClient) {
    return authClient;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
    
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    authClient = await auth.getClient();
    return authClient;
  } catch (error) {
    console.error('Error creating Google Auth client:', error);
    throw new Error('Failed to authenticate with Google Cloud');
  }
}

/**
 * Get authorization headers for authenticated requests to Cloud Run
 * This should only be called on the server side
 */
export async function getAuthHeaders() {
  try {
    const client = await getGoogleAuthClient();
    const headers = await client.getRequestHeaders();
    return headers;
  } catch (error) {
    console.error('Error getting auth headers:', error);
    throw new Error('Failed to get authentication headers');
  }
}

/**
 * Make an authenticated request to the Cloud Run API
 * This should only be called on the server side
 */
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  try {
    const authHeaders = await getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response;
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}

