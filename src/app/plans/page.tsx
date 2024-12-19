'use client';
import { useState, useEffect, Suspense } from 'react';
import { Check, Loader2, Crown } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Try out our AI video creation platform',
    features: [
      'Generate up to 5 videos/month',
      'Up to 1 minute per video',
      'Access to basic avatars',
      'HD video quality (720p)',
      '7-day video storage',
      'Community support',
    ],
    popular: false,
  },
  {
    name: 'Founder',
    price: 49,
    description: 'Perfect for creators getting started with AI videos',
    features: [
      'Generate up to 15 videos/month',
      'Up to 3 minutes per video',
      'Access to all avatars',
      'HD video quality (720p)',
      '30-day video storage',
      'Basic email support',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 99,
    description: 'For professional content creators who need more capacity',
    features: [
      'Generate up to 40 videos/month',
      'Up to 5 minutes per video',
      'Access to all avatars',
      'Full HD video quality (1080p)',
      '90-day video storage',
      'Priority email support',
      'Download videos for offline use',
    ],
    popular: true,
  },
];

function PlansContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('Free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (subscription && !error) {
            setCurrentPlan(subscription.plan_name);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching plan:', error);
        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
  }, [supabase]);

  const handleSubscribe = async (planName: string) => {
    if (planName === currentPlan) {
      showToast('You are already subscribed to this plan', 'error');
      return;
    }

    if (planName === 'Free') {
      showToast('You are now on the free plan', 'success');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedPlan(planName);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/?authRequired=true');
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error subscribing to plan:', err);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get started with our flexible pricing plans. Choose the plan that best fits your needs.
          All plans include our core features with different usage limits.
        </p>
        {currentPlan && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full">
            <Crown className="w-4 h-4" />
            <span>Current Plan: {currentPlan}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
              plan.popular ? 'ring-2 ring-blue-500' : ''
            } ${currentPlan === plan.name ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Most Popular
              </div>
            )}
            {currentPlan === plan.name && (
              <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-br-lg">
                Current Plan
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading && selectedPlan === plan.name || currentPlan === plan.name}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  currentPlan === plan.name
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 cursor-default'
                    : plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {loading && selectedPlan === plan.name ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : currentPlan === plan.name ? (
                  'Current Plan'
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Plans() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <PlansContent />
    </Suspense>
  );
} 