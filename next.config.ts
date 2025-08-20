import type { NextConfig } from 'next';

// Load environment variables from .env file
require('dotenv').config();

// Read hostnames from environment variable, split by comma, and trim whitespace
const imageHostnames = process.env.IMAGE_HOSTNAMES
    ? process.env.IMAGE_HOSTNAMES.split(',').map(h => h.trim())
    : ['placehold.co'];

// Generate remote patterns for each hostname
const remotePatterns = imageHostnames.map(hostname => ({
    protocol: 'https',
    hostname,
    port: '',
    pathname: '/**',
}));


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
