/** @type {import('next').NextConfig} */
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
}
