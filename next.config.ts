import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
  },
};

// Validate required environment variables
const requiredEnvs = [
  'HEYGEN_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_FOUNDER_PRICE_ID',
  'STRIPE_PRO_PRICE_ID',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Environment variable ${env} is required`);
  }
}

export default nextConfig;
