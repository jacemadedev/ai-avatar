import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get the price ID from the subscription
        const priceId = subscription.items.data[0].price.id;

        // Map price ID to plan name
        const planMap: { [key: string]: string } = {
          [process.env.STRIPE_FOUNDER_PRICE_ID!]: 'Founder',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'Pro'
        };

        const planName = planMap[priceId] || 'Free';

        // Get user ID from customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (customerError || !customerData) {
          console.error('Error fetching customer:', customerError);
          return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Update or insert subscription
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
          console.error('Error deleting subscription:', deleteError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}; 