-- Run this in your Supabase SQL editor to set up the database

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date timestamptz,
  created_at timestamptz not null default now()
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  language text not null,
  lesson_id text not null,
  completed boolean not null default false,
  score integer not null default 0,
  completed_at timestamptz not null default now(),
  unique(user_id, language, lesson_id)
);

-- Enable row level security
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Profiles: users can only read/write their own row
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Progress: users can only read/write their own progress
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);
