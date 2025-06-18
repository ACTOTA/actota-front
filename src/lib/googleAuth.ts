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
    // Check if the environment variable exists
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    // Clean up the JSON string - remove extra quotes and fix escaped newlines
    let cleanedKey = serviceAccountKey.trim();
    
    // Remove surrounding quotes if they exist
    if (cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) {
      cleanedKey = cleanedKey.slice(1, -1);
    }
    
    // Replace escaped newlines with actual newlines in the private key
    cleanedKey = cleanedKey.replace(/\\n/g, '\n');
    
    console.log('Attempting to parse service account key...');
    const credentials = JSON.parse(cleanedKey);
    
    // Validate that we have the required fields
    if (!credentials.private_key || !credentials.client_email) {
      throw new Error('Invalid service account key: missing required fields');
    }
    
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    authClient = await auth.getClient();
    console.log('Google Auth client created successfully');
    return authClient;
  } catch (error) {
    console.error('Error creating Google Auth client:', error);
    if (error instanceof SyntaxError) {
      console.error('JSON parsing failed. The GOOGLE_SERVICE_ACCOUNT_KEY might be malformed.');
      console.error('First 200 characters of the key:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.substring(0, 200));
    }
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

