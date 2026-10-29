import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    cpus: 1,
  },
  allowedDevOrigins: ["localhost", "127.0.0.1", "localhost:3000", "localhost:3001", "127.0.0.1:3000", "127.0.0.1:3001"],
};

export default nextConfig;
