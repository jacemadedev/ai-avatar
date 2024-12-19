# Face Card - AI Video Creation Platform

Face Card is a powerful AI-powered video creation platform that allows users to generate professional videos using virtual avatars.

## Features

- AI-powered video generation
- Customizable virtual avatars
- Multiple voice options
- HD video quality
- Subscription-based plans
- Video management system

## Tech Stack

- Next.js 15
- TypeScript
- Supabase
- Stripe
- Tailwind CSS
- Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/face-card.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

- **Supabase Configuration**
  - Get these from your Supabase project settings
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

- **HeyGen Configuration**
  - Sign up at HeyGen to get your API key
  - `HEYGEN_API_KEY`

- **Stripe Configuration**
  - Get these from your Stripe dashboard
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_FOUNDER_PRICE_ID`
  - `STRIPE_PRO_PRICE_ID`

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment

The app is configured for deployment on Vercel. Simply push to your GitHub repository and connect it to Vercel for automatic deployments.

### Environment Variables

When deploying to Vercel, make sure to add all the environment variables from `.env.example` to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all required environment variables
4. Redeploy your application

### Production Considerations

- Set up Stripe webhooks for production
- Configure proper CORS settings in Supabase
- Set up proper domain and SSL certificates
- Configure proper backup strategies for your database
