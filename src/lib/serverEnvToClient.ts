// Type definition for environment variables we want to expose
export interface EnvConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  // Add other environment variables as needed
}

/**
 * Function to get server-side environment variables to pass to client components
 * Use this in server components to pass environment values to client components
 */
export function getServerEnvironment(): EnvConfig {
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  };
}
