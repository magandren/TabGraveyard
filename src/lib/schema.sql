-- Run this in your Supabase SQL Editor: written with help

create table tabs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  url text not null,
  title text,
  summary text,
  category text default 'Uncategorized',
  status text default 'active', -- active, archived, deleted
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table tabs enable row level security;

-- Create policies
create policy "Users can view their own tabs"
  on tabs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tabs"
  on tabs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tabs"
  on tabs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own tabs"
  on tabs for delete
  using ( auth.uid() = user_id );

-- If you already created the table, run this instead:
-- alter table tabs add column category text default 'Uncategorized';

