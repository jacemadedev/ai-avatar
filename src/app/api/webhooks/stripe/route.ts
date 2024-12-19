import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get('stripe-signature') ?? '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        const planMap: { [key: string]: string } = {
          [process.env.STRIPE_FOUNDER_PRICE_ID!]: 'Founder',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'Pro'
        };

        const planName = planMap[priceId] || 'Free';

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (customerError) {
          console.error('Error fetching customer:', customerError);
          return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            id: subscription.id,
            user_id: customerData.id,
            status: subscription.status,
            plan_name: planName,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            stripe_customer_id: customerId,
          }, {
            onConflict: 'id'
          });

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: false
          })
          .eq('id', subscription.id);

        if (deleteError) {
          console.error('Error updating subscription:', deleteError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 