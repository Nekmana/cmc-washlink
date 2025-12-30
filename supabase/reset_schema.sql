-- CLEANUP: Drop existing tables and triggers if they exist
-- Run this if you get "relation already exists" errors

-- 1. Drop Triggers and Functions
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop trigger if exists on_orders_updated on orders;
drop function if exists handle_updated_at();

-- 2. Drop Tables (Order matters because of foreign keys)
drop table if exists reviews;
drop table if exists orders;
drop table if exists profiles;

-- 3. RE-CREATE EVERYTHING

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public User Data)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('customer', 'washer')) default 'customer',
  dorm_block text,
  room_number text,
  avatar_url text,
  total_washes int default 0,
  rating decimal(3, 2) default 5.0,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- ORDERS
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references profiles(id) not null,
  washer_id uuid references profiles(id),
  status text check (status in ('pending', 'accepted', 'washing', 'ready', 'completed', 'cancelled')) default 'pending',
  weight_kg decimal(4,1),
  clothes_type text,
  pickup_time timestamp with time zone,
  price decimal(10, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Orders
alter table orders enable row level security;
create policy "Customers can see their own orders." on orders for select using (auth.uid() = customer_id);
create policy "Washers can see available (pending) orders and their accepted orders." on orders for select using (
  (status = 'pending') or (washer_id = auth.uid()) or (customer_id = auth.uid())
);
create policy "Customers can create orders." on orders for insert with check (auth.uid() = customer_id);
create policy "Washers can update orders they've accepted." on orders for update using (auth.uid() = washer_id);
create policy "Washers can accept pending orders." on orders for update using (status = 'pending' and washer_id is null);

-- REVIEWS
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) not null,
  reviewer_id uuid references profiles(id) not null,
  reviewee_id uuid references profiles(id) not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Reviews
alter table reviews enable row level security;
create policy "Reviews are viewable by everyone." on reviews for select using (true);
create policy "Participants can create reviews." on reviews for insert with check (auth.uid() = reviewer_id);

-- Triggers for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_orders_updated
  before update on orders
  for each row execute procedure handle_updated_at();

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
