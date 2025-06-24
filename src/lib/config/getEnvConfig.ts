import { GetServerSidePropsContext } from 'next';

// Runtime config type that matches our client-env.ts
export interface RuntimeConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  // Add any other NEXT_PUBLIC variables as needed
}

/**
 * Gets environment variables for client-side use
 * This function can be called from getServerSideProps
 */
export function getEnvConfig(): RuntimeConfig {
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    // Add other NEXT_PUBLIC variables as needed
  };
}

/**
 * Helper to inject environment config into page props
 * Use this in getServerSideProps functions
 */
export function withEnvConfig<T extends Record<string, any>>(props: T) {
  return {
    ...props,
    envConfig: getEnvConfig(),
  };
}

/**
 * Utility function to add environment variables to any getServerSideProps function
 * @param getServerSidePropsFunc - Your existing getServerSideProps function or undefined
 */
export function withServerSideEnvConfig(
  getServerSidePropsFunc?: (context: GetServerSidePropsContext) => Promise<{ props: any }>
) {
  return async (context: GetServerSidePropsContext) => {
    if (getServerSidePropsFunc) {
      // If there's an existing getServerSideProps function, call it and merge props
      const { props: existingProps } = await getServerSidePropsFunc(context);
      return {
        props: withEnvConfig(existingProps),
      };
    }
    
    // If no existing function, just return environment config
    return {
      props: withEnvConfig({}),
    };
  };
}