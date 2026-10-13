import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  async rewrites() {
    return [{ source: "/test", destination: "http://localhost:5000/test" }];
  },
};

export default nextConfig;
