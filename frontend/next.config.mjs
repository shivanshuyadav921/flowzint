import createWithVercelToolbar from "@vercel/toolbar/plugins/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
  // Enable standalone output for optimized Vercel deployment
  output: "standalone",
};

const withVercelToolbar = createWithVercelToolbar();

export default withVercelToolbar(nextConfig);
