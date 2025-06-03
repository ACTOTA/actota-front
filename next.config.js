/** @type {import('next').NextConfig} */
const { publicRuntimeConfig } = require('./src/lib/config/public-runtime');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'upload-widget.cloudinary.com',
      'links.papareact.com',
      'storage.googleapis.com'
    ]
  },
  output: 'standalone', // Added for Docker deployment
  experimental: {
    // Server Actions are now enabled by default
  },
  // Disable static optimization for all pages since we need dynamic functionality
  staticPageGenerationTimeout: 120,
  // Make environment variables available at runtime
  publicRuntimeConfig,
  // Ensure environment variables are available during build and runtime
  env: publicRuntimeConfig,
  webpack: (config, { isServer }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Handle Node.js modules properly on client-side
    if (!isServer) {
      // Prevent certain Node.js modules from being bundled on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        mongodb: false,
      };
    }
    
    return config;
  },
}
