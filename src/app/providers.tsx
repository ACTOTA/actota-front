"use client";

import { Toaster } from "sonner";
import ReactQueryProvider from "@/src/providers/react-query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <Toaster position="bottom-center" />
      {children}
    </ReactQueryProvider>
  );
}
