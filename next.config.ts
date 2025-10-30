import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
  },
  reactCompiler : true,
  experimental : { 
     turbopackFileSystemCacheForDev : true,
  }
};

export default nextConfig;
