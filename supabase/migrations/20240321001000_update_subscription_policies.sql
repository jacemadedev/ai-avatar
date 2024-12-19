-- Drop existing policies
drop policy if exists "Service role can manage all records" on public.customers;
drop policy if exists "Service role can manage all subscriptions" on public.subscriptions;

-- Create new policies with proper service role access
create policy "Service role can manage customers"
  on public.customers for all
  using (auth.jwt() ->> 'role' = 'service_role'::text)
  with check (auth.jwt() ->> 'role' = 'service_role'::text);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.jwt() ->> 'role' = 'service_role'::text)
  with check (auth.jwt() ->> 'role' = 'service_role'::text); 