import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "**.logo.dev",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;

