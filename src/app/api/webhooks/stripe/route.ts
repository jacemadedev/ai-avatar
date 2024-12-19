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

        // Get the Supabase user ID from metadata
        const supabaseUserId = subscription.metadata.supabase_user_id;

        if (!supabaseUserId) {
          console.error('No Supabase user ID in metadata');
          return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 });
        }

        // First, ensure customer exists
        const { error: customerUpsertError } = await supabase
          .from('customers')
          .upsert({
            id: supabaseUserId,
            stripe_customer_id: customerId,
          });

        if (customerUpsertError) {
          console.error('Error upserting customer:', customerUpsertError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const planMap: { [key: string]: string } = {
          [process.env.STRIPE_FOUNDER_PRICE_ID!]: 'Founder',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'Pro'
        };

        const planName = planMap[priceId] || 'Free';

        // Add these fields to the upsert
        const subscriptionData = {
          id: subscription.id,
          user_id: supabaseUserId,
          status: subscription.status,
          plan_name: planName,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
          stripe_customer_id: customerId,
          created_at: new Date(subscription.created * 1000).toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData);

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          console.error('Subscription data:', {
            id: subscription.id,
            user_id: supabaseUserId,
            status: subscription.status,
            plan_name: planName,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            stripe_customer_id: customerId
          });
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

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        const supabaseUserId = session.metadata?.supabase_user_id;

        if (!supabaseUserId) {
          console.error('No Supabase user ID in metadata');
          return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 });
        }

        const planMap: { [key: string]: string } = {
          [process.env.STRIPE_FOUNDER_PRICE_ID!]: 'Founder',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'Pro'
        };

        const planName = planMap[priceId] || 'Free';

        // Update subscription status
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            id: subscriptionId,
            user_id: supabaseUserId,
            status: subscription.status,
            plan_name: planName,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            stripe_customer_id: customerId,
            created_at: new Date(subscription.created * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subscriptionError) {
          console.error('Error updating subscription after payment:', subscriptionError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', subscriptionId);

          if (updateError) {
            console.error('Error updating subscription after invoice paid:', updateError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 