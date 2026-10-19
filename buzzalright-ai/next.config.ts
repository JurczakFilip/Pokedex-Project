import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  async rewrites() {
    return [
      { source: "/signup", destination: "http://localhost:5000/signup" }, 
      { source: "/verifycookie", destination: "http://localhost:5000/verifycookie"},
      { source: "/getuser", destination: "http://localhost:5000/getuser"}
    ];
  },
};

export default nextConfig;
