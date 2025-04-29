// Client-side environment variable utility
// This allows accessing environment variables in client components

// Define the runtime config type that will be injected via script
interface RuntimeConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: string;
  // Add any other NEXT_PUBLIC variables as needed
}

// Default values - these are used during development or as a fallback
const defaultConfig: RuntimeConfig = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  // Add other default values for NEXT_PUBLIC variables
};

// Get environment variables, prioritizing runtime config
export function getClientEnv(): RuntimeConfig {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Try to get runtime config injected by our entrypoint script
    const runtimeConfig = (window as any).__NEXT_PUBLIC_RUNTIME_CONFIG;
    
    if (runtimeConfig) {
      return {
        ...defaultConfig,
        ...runtimeConfig,
      };
    }
  }
  
  // Fall back to default config (process.env values at build time)
  return defaultConfig;
}

// Export individual environment variables for convenience
export const clientEnv = getClientEnv();