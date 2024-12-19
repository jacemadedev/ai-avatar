-- Add video tracking columns to users table
alter table public.users add column if not exists monthly_video_count integer default 0;
alter table public.users add column if not exists last_video_count_reset timestamp with time zone default now();

-- Create function to reset monthly video count
create or replace function public.reset_monthly_video_count()
returns trigger as $$
begin
  if new.last_video_count_reset < date_trunc('month', now()) then
    new.monthly_video_count := 0;
    new.last_video_count_reset := now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically reset monthly video count
drop trigger if exists reset_monthly_video_count_trigger on public.users;
create trigger reset_monthly_video_count_trigger
  before update on public.users
  for each row
  execute function public.reset_monthly_video_count();

-- Add plan_name column to subscriptions table if not exists
alter table public.subscriptions add column if not exists plan_name text default 'Free';

-- Create RLS policies for video tracking
alter table public.users enable row level security;

create policy "Users can update their own video count"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read their own video count"
  on public.users
  for select
  using (auth.uid() = id);

-- Grant necessary permissions
grant usage on sequence public.users_id_seq to authenticated;
grant select, update(monthly_video_count, last_video_count_reset) on public.users to authenticated; 