import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // Output standalone for Vercel
  output: undefined,
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
