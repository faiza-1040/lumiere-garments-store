/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images and optimize them
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimisticClientCache: true,
  },
};

export default nextConfig;
