/** @type {import("next").NextConfig} */
const nextConfig = {
  // Turn OFF Turbopack completely
  experimental: {
    // this disables the turbopack worker
    webpackBuildWorker: false,
  },

  // Force Next.js to use Webpack instead of Turbopack
  webpack: (config: any) => {
    // ignore test files inside thread-stream or other backend deps
    config.module.rules.push({
      test: /\.test\.js$/,
      use: 'null-loader',
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
  },

  reactCompiler: true,
};

module.exports = nextConfig;
