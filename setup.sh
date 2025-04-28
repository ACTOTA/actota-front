#!/bin/bash
set -e

echo "===== Setting up Actota Frontend ====="

# Remove existing modules and Next.js build cache
if [ -d "node_modules" ]; then
  echo "Removing existing node_modules directory..."
  rm -rf node_modules
fi

if [ -d ".next" ]; then
  echo "Removing existing .next directory..."
  rm -rf .next
fi

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Fix server components issues
echo "Running server component fixes..."
if [ -f ./fix-server-components.sh ]; then
  bash ./fix-server-components.sh
else
  # Fallback if script not found
  echo "fix-server-components.sh not found, using inline fix..."
  
  # Manually create react-server-dom-webpack directory if it doesn't exist
  if [ ! -d "node_modules/react-server-dom-webpack" ]; then
    echo "Creating react-server-dom-webpack directory..."
    mkdir -p node_modules/react-server-dom-webpack
  fi

  # Check if Next.js is installed and if server.edge.js is available
  if [ -d "node_modules/next/dist/compiled/react-server-dom-webpack" ]; then
    echo "Copying server.edge.js from Next.js compiled directory..."
    cp node_modules/next/dist/compiled/react-server-dom-webpack/server.edge.js node_modules/react-server-dom-webpack/server.edge.js
  fi
fi

# Build the application
echo "Ready for build"
echo "Run 'npm run build' to build for production"
echo "or 'npm run dev' to start the development server"

echo "===== Setup complete ====="