-- Create customers table if not exists
create table if not exists public.customers (
  id uuid references auth.users on delete cascade,
  stripe_customer_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create subscriptions table if not exists
create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text not null,
  plan_name text not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean not null default false,
  stripe_customer_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

-- Customers policies
create policy "Users can view own customer data"
  on public.customers for select
  using (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Allow the service role to manage all records
create policy "Service role can manage all records"
  on public.customers for all
  using (auth.role() = 'service_role');

create policy "Service role can manage all subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- Add updated_at trigger for subscriptions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at(); 