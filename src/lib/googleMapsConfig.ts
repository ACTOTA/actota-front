'use server';

// Server action to get Google Maps API key for client-side map rendering
// This is still exposed to the client, but provides better control
export async function getGoogleMapsApiKey(): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured');
    throw new Error('Google Maps API key not configured');
  }
  
  return apiKey;
}
