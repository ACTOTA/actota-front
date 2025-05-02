'use client';

import { createContext, useContext, ReactNode } from 'react';
import { EnvConfig } from '@/src/lib/serverEnvToClient';

// Create a context to hold the environment variables
const EnvContext = createContext<EnvConfig | null>(null);

// Provider component that will be used in server components to pass environment to clients
export function ServerEnvProvider({ 
  children, 
  envConfig 
}: { 
  children: ReactNode; 
  envConfig: EnvConfig; 
}) {
  return (
    <EnvContext.Provider value={envConfig}>
      {children}
    </EnvContext.Provider>
  );
}

// Hook to use the environment variables in client components
export function useServerEnv() {
  const context = useContext(EnvContext);
  
  if (!context) {
    throw new Error('useServerEnv must be used within a ServerEnvProvider');
  }
  
  return context;
}