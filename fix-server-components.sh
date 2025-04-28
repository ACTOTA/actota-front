#!/bin/bash
set -e

# This script fixes the react-server-dom-webpack server.edge dependency issue
# It should be run in the Docker container before building the application

echo "Fixing react-server-dom-webpack server.edge module..."

# Check if the react-server-dom-webpack directory exists
if [ ! -d "node_modules/react-server-dom-webpack" ]; then
  echo "Creating react-server-dom-webpack directory..."
  mkdir -p node_modules/react-server-dom-webpack
fi

# Check if next.js compiled version exists
if [ -f "node_modules/next/dist/compiled/react-server-dom-webpack/server.edge.js" ]; then
  echo "Found compiled server.edge.js, copying to module directory..."
  cp node_modules/next/dist/compiled/react-server-dom-webpack/server.edge.js node_modules/react-server-dom-webpack/server.edge.js
  echo "✅ Successfully fixed react-server-dom-webpack/server.edge dependency"
else
  echo "❌ Could not find compiled server.edge.js in next.js directory"
  exit 1
fi