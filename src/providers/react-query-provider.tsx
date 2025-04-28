import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import React, { ReactNode, useState } from "react";

const cacheTime = 3600 * 1000 * 24; // 1 day

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            gcTime: cacheTime,
            retry: false,
          },
        },
      }),
  );

  const persister = createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  });
  const doNotPersistQueries: QueryKey = [];

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: cacheTime,
        dehydrateOptions: {
          shouldDehydrateQuery: (query: any) => {
            return (
              defaultShouldDehydrateQuery(query) &&
              !doNotPersistQueries.includes(query.queryKey[0])
            );
          },
        },
      }}
    >
      {children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
