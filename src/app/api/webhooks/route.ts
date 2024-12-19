import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Configure Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Initialize Supabase client with service role for webhook handling
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
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature found', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse(
        `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
        { status: 400 }
      );
    }

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        if (customer.metadata.supabase_user_id) {
          const { error } = await supabase
            .from('customers')
            .upsert({
              id: customer.metadata.supabase_user_id,
              stripe_customer_id: customer.id,
            });

          if (error) {
            console.error('Error creating customer:', error);
            return new NextResponse('Error creating customer', { status: 500 });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user_id from customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id') // id is the user_id
          .eq('stripe_customer_id', customerId)
          .single();

        if (customerError || !customerData) {
          console.error('No customer found for stripe_customer_id:', customerId);
          return new NextResponse('Customer not found', { status: 404 });
        }

        // Update subscriptions table
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            id: subscription.id,
            user_id: customerData.id,
            status: subscription.status,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity,
            cancel_at_period_end: subscription.cancel_at_period_end,
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          });

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          return new NextResponse('Error updating subscription', { status: 500 });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', deletedSubscription.id);

        if (deleteError) {
          console.error('Error updating deleted subscription:', deleteError);
          return new NextResponse('Error updating subscription', { status: 500 });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
      { status: 400 }
    );
  }
} 