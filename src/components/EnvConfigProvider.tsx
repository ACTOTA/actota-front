import { RuntimeConfig } from '@/src/lib/config/getEnvConfig';
import Script from 'next/script';

interface EnvConfigProviderProps {
  envConfig: RuntimeConfig;
}

/**
 * Component that injects server-provided environment variables into the client
 * This should be used in pages that implement getServerSideProps with withServerSideEnvConfig
 */
export default function EnvConfigProvider({ envConfig }: EnvConfigProviderProps) {
  const configScript = `
    window.__NEXT_SERVER_ENV_CONFIG = ${JSON.stringify(envConfig)};
  `;

  return (
    <Script 
      id="server-env-config"
      dangerouslySetInnerHTML={{ __html: configScript }}
      strategy="beforeInteractive"
    />
  );
}