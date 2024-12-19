-- Create customers table
create table if not exists public.customers (
  id uuid references auth.users on delete cascade not null primary key,
  stripe_customer_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  quantity integer,
  cancel_at_period_end boolean default false,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table customers enable row level security;
alter table subscriptions enable row level security;

-- Create RLS policies
create policy "Users can view their own customer data."
  on customers for select
  using (auth.uid() = id);

create policy "Users can update their own customer data."
  on customers for update
  using (auth.uid() = id);

create policy "Users can view their own subscriptions."
  on subscriptions for select
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists customers_stripe_customer_id_idx on customers(stripe_customer_id);
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_stripe_subscription_id_idx on subscriptions(stripe_subscription_id); 