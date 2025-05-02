'use client';

import { useEffect } from 'react';
import { RuntimeConfig, setServerProvidedEnv } from '@/src/lib/config/client-env';

/**
 * Client component that receives server environment variables and makes them available
 * to all client components via the client-env.ts utility
 */
export default function EnvProvider({ env, children }: { 
  env: RuntimeConfig;
  children: React.ReactNode;
}) {
  // Set the server environment on component mount
  useEffect(() => {
    // Make server-provided env variables available to client code
    setServerProvidedEnv(env);
  }, [env]);

  return <>{children}</>;
}