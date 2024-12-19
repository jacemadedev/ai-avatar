'use client';
import { useState, useEffect, Suspense } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

// Define types for the plan and PlanCard props
interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onSubscribe: (planName: string) => void;
  isCurrentPlan: boolean;
  isLoading: boolean;
  selectedPlan: string | null;
}

const PLANS: Plan[] = [
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

function PlanCard({ plan, onSubscribe, isCurrentPlan, isLoading, selectedPlan }: PlanCardProps) {
  return (
    <div className={`
      relative p-6 lg:p-8 rounded-2xl border 
      ${plan.popular ? 'border-blue-500' : 'border-gray-200 dark:border-gray-800'}
      ${isCurrentPlan ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-[#1d1d1f]'}
      flex flex-col h-full
    `}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <div className="flex items-baseline mb-3">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.name)}
        disabled={isLoading && selectedPlan === plan.name}
        className={`
          w-full py-3 rounded-lg text-sm font-medium transition-colors
          ${isCurrentPlan 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
            : 'bg-blue-500 text-white hover:bg-blue-600'}
        `}
      >
        {isLoading && selectedPlan === plan.name ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          'Subscribe'
        )}
      </button>
    </div>
  );
}

function PlansContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('Free');
  const [loading, setLoading] = useState(false);
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
      showToast('Failed to process subscription. Please try again.', 'error');
      setSelectedPlan(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select the perfect plan for your needs. All plans include access to our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            onSubscribe={handleSubscribe}
            isCurrentPlan={currentPlan === plan.name}
            isLoading={loading}
            selectedPlan={selectedPlan}
          />
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