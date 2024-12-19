import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Validate required environment variables
const requiredEnvs = ['HEYGEN_API_KEY'];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Environment variable ${env} is required`);
  }
}

export default nextConfig;
