#!/bin/bash
set -e

echo "=== Docker Entrypoint Script ==="

# Create a runtime environment file for NEXT_PUBLIC variables
echo "Creating runtime environment configuration..."

# Create directory for runtime configuration
mkdir -p public/runtime-config

# Generate runtime config JS file with current environment variables
cat > public/runtime-config/env.js << EOF
// This file is generated at runtime by docker-entrypoint.sh
window.__NEXT_PUBLIC_RUNTIME_CONFIG = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL}",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}",
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}",
  // Add other NEXT_PUBLIC_ variables here as needed
};
EOF

echo "Runtime environment variables configured!"

# Check for .next directory
if [ ! -d ".next" ]; then
  echo "Warning: .next directory not found. Attempting to build the application..."
  
  # Run our server component fix first
  if [ -f ./fix-server-components.sh ]; then
    echo "Running server component fixes..."
    bash ./fix-server-components.sh
  else
    echo "Warning: fix-server-components.sh not found. Build may fail."
  fi
  
  # Try to build the application
  echo "Building Next.js application..."
  NODE_OPTIONS="--max-old-space-size=4096" npm run build
  
  # Verify build was successful
  if [ ! -d ".next" ]; then
    echo "Error: Build failed - .next directory still not found."
    exit 1
  fi
else
  echo ".next directory found. Using existing build."
fi

# List the build contents
echo "Listing .next directory contents:"
ls -la .next/

# Start the application
echo "Starting Next.js production server on port 8080..."
if [ -f ".next/standalone/server.js" ]; then
  echo "Using standalone server.js (recommended for 'output: standalone')..."
  NODE_ENV=production PORT=8080 exec node .next/standalone/server.js
else
  echo "Using next start command..."
  NODE_ENV=production exec npx next start -p 8080
fi