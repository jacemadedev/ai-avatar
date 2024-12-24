# AI Avatar

A modern web application built with Next.js 15, TypeScript, and Supabase, featuring Stripe integration for payments.

## 🚀 Features

- Next.js 15 with App Router
- TypeScript for type safety
- Supabase for authentication and database
- Stripe integration for payments
- Tailwind CSS for styling
- Framer Motion for animations
- ESLint for code quality
- Husky for Git hooks
- Automatic sitemap generation

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account
- Stripe account
-Heygen account

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-avatar.git
cd ai-avatar
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
- Supabase configuration
- Stripe API keys
- Heygen API keys
- Other environment-specific variables

## 🚀 Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
ai-avatar/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── middleware.ts  # Next.js middleware
├── public/           # Static assets
├── scripts/         # Build and utility scripts
├── supabase/        # Supabase configurations
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postbuild` - Generate sitemap

## 🚀 Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes the necessary configuration.

To deploy:
1. Push to your GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
