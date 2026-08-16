import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:  "imgs.search.brave.com"
      }
    ]
  }
};

export default nextConfig;
