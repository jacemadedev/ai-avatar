'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/');
          return;
        }

        // Poll for subscription status
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 2000; // 2 seconds

        const checkStatus = async () => {
          const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            throw error;
          }

          if (subscription?.status === 'active') {
            setLoading(false);
            setTimeout(() => router.push('/create'), 2000);
            return true;
          }

          if (attempts >= maxAttempts) {
            throw new Error('Subscription activation timeout');
          }

          attempts++;
          return false;
        };

        const poll = async () => {
          const isActive = await checkStatus();
          if (!isActive) {
            setTimeout(poll, pollInterval);
          }
        };

        await poll();

      } catch (error) {
        console.error('Error checking subscription:', error);
        setError('Failed to verify subscription. Please contact support.');
        setLoading(false);
      }
    };

    checkSubscription();
  }, [supabase, router]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.push('/plans')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Return to Plans
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">
          Thank You for Your Subscription!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Your account has been successfully upgraded. You now have access to all premium features.
        </p>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Redirecting to create page in a few seconds...
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => router.push('/create')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Creating Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 