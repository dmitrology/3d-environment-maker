/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["media.sketchfab.com"],
    unoptimized: true,
  },
  // Removed experimental.esmExternals as it may disrupt module resolution
}

module.exports = nextConfig
