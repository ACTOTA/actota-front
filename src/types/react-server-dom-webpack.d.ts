/**
 * Type declarations for react-server-dom-webpack
 * This resolves the TypeScript errors for the missing module
 */
declare module 'react-server-dom-webpack/server.edge' {
  import * as React from 'react';
  
  // Export the expected API for Next.js server components
  export function renderToReadableStream(
    element: React.ReactElement,
    options?: any
  ): ReadableStream;
}