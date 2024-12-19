-- Add new columns for cancellation tracking
alter table public.subscriptions 
add column if not exists cancel_at timestamp with time zone,
add column if not exists canceled_at timestamp with time zone; 