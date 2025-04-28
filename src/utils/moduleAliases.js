/**
 * This file provides module resolution patches for issues with server components.
 * It's loaded early in the application bootstrap process.
 */

const path = require('path');
const fs = require('fs');

// Define module resolution for 'react-server-dom-webpack/server.edge'
// which is often missing in Next.js App Router setups
const resolveServerComponents = () => {
  const targetPath = path.resolve(process.cwd(), 'node_modules/react-server-dom-webpack/server.edge.js');
  
  // Check if the file exists
  if (!fs.existsSync(targetPath)) {
    // Try to locate it in Next.js compiled directory
    const nextPath = path.resolve(process.cwd(), 'node_modules/next/dist/compiled/react-server-dom-webpack/server.edge.js');
    
    if (fs.existsSync(nextPath)) {
      // Create a directory if it doesn't exist
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Create a symlink or copy the file
      fs.copyFileSync(nextPath, targetPath);
      console.log('✅ Created server.edge.js module for react-server-dom-webpack');
    } else {
      console.error('❌ Could not find react-server-dom-webpack/server.edge.js');
    }
  }
};

// Export function to be called from next.config.js
module.exports = {
  resolveServerComponents,
};