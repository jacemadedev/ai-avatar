import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const PLANS = {
  'Founder': {
    price: process.env.STRIPE_FOUNDER_PRICE_ID,
    name: 'Founder Plan'
  },
  'Pro': {
    price: process.env.STRIPE_PRO_PRICE_ID,
    name: 'Pro Plan'
  }
};

export async function POST(req: Request) {
  try {
    const { planName } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const plan = PLANS[planName as keyof typeof PLANS];
    if (!plan) {
      return new NextResponse('Invalid plan', { status: 400 });
    }

    // Get or create customer
    const { data: customerData } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    let customerId = customerData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          supabase_user_id: session.user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from('customers')
        .insert([{ id: session.user.id, stripe_customer_id: customerId }]);
    }

    const session_url = new URL(req.url);
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${session_url.origin}/dashboard?success=true`,
      cancel_url: `${session_url.origin}/plans?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: session.user.id,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 