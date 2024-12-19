import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ToastProvider } from '@/contexts/ToastContext';

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Face Card - AI Video Creation Platform',
    template: '%s | Face Card'
  },
  description: 'Create professional AI-powered videos with virtual avatars. Generate engaging content with customizable avatars, voices, and HD quality.',
  keywords: ['AI video creation', 'virtual avatars', 'AI content', 'video generation', 'content creation'],
  authors: [{ name: 'Face Card' }],
  openGraph: {
    title: 'Face Card - AI Video Creation Platform',
    description: 'Create professional AI-powered videos with virtual avatars',
    url: 'https://facecardai.com',
    siteName: 'Face Card',
    images: [
      {
        url: '/og-image.jpg', // Create this image in public folder
        width: 1200,
        height: 630,
        alt: 'Face Card Preview'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Face Card - AI Video Creation Platform',
    description: 'Create professional AI-powered videos with virtual avatars',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add this after setting up Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ToastProvider>
          <div className="min-h-screen bg-[#f5f5f7] dark:bg-black">
            <Sidebar />
            <div className="lg:ml-[280px]">
              <Header />
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
