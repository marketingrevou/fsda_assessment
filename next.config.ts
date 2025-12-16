import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Image Optimization API as it's not needed for static exports
  },
  // Ensure we're using the correct base path for static assets
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Enable static exports for Vercel
  output: 'export',
  // Optional: Add assetPrefix if you're deploying to a subdirectory
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
};

export default nextConfig;
