// Environment variables configuration
const env = {
  // API URL for server-side and client-side
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Stripe integration
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // Google Maps integration
  NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  
  // Add any other NEXT_PUBLIC variables used in the app
};

// Type for the env object
export type EnvType = typeof env;

// Validate that required environment variables are present
const validateEnv = (): EnvType => {
  // In production, validate all required environment variables
  if (process.env.NODE_ENV === 'production') {
    const requiredVars = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_GOOGLE_MAPS_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !env[varName as keyof typeof env]);
    
    if (missingVars.length > 0) {
      console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
  
  return env;
};

// Export validated environment variables
export const validEnv = validateEnv();