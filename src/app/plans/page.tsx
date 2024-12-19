'use client';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const PLANS = [
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

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSubscribe = async (planName: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPlan(planName);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/?authRequired=true');
        return;
      }

      // TODO: Implement Stripe integration
      console.log(`Subscribing to ${planName} plan`);

    } catch (err) {
      console.error('Error subscribing to plan:', err);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get started with our flexible pricing plans. Choose the plan that best fits your needs.
          All plans include our core features with different usage limits.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
              plan.popular ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Most Popular
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
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
                disabled={loading && selectedPlan === plan.name}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {loading && selectedPlan === plan.name ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>All plans include a 14-day money-back guarantee</p>
        <p className="mt-2">
          Need a custom plan? <button className="text-blue-500 hover:underline">Contact us</button>
        </p>
      </div>
    </div>
  );
} 