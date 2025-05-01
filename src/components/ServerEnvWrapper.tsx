import EnvProvider from './EnvProvider';

/**
 * Server component that reads env variables from the server and passes them to the EnvProvider
 */
export default function ServerEnvWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs on the server where process.env is available
  const serverEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    // Add other NEXT_PUBLIC variables here
  };

  return (
    <EnvProvider env={serverEnv}>
      {children}
    </EnvProvider>
  );
}