-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create sales table
create table public.sales (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  product_name text not null,
  price numeric(10,2) not null,
  quantity numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sales enable row level security;

create policy "Users can view own sales"
  on public.sales for select
  using (auth.uid() = user_id);

create policy "Users can insert own sales"
  on public.sales for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sales"
  on public.sales for update
  using (auth.uid() = user_id);

create policy "Users can delete own sales"
  on public.sales for delete
  using (auth.uid() = user_id);

-- Create earnings table
create table public.earnings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  mode_name text not null,
  amount numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.earnings enable row level security;

create policy "Users can view own earnings"
  on public.earnings for select
  using (auth.uid() = user_id);

create policy "Users can insert own earnings"
  on public.earnings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own earnings"
  on public.earnings for update
  using (auth.uid() = user_id);

create policy "Users can delete own earnings"
  on public.earnings for delete
  using (auth.uid() = user_id);

-- Create expenses table
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  item_name text not null,
  price numeric(10,2) not null,
  quantity numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Create employee_cash table
create table public.employee_cash (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  type text not null check (type in ('short', 'borrow', 'received', 'reward')),
  person_name text not null,
  amount numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.employee_cash enable row level security;

create policy "Users can view own employee_cash"
  on public.employee_cash for select
  using (auth.uid() = user_id);

create policy "Users can insert own employee_cash"
  on public.employee_cash for insert
  with check (auth.uid() = user_id);

create policy "Users can update own employee_cash"
  on public.employee_cash for update
  using (auth.uid() = user_id);

create policy "Users can delete own employee_cash"
  on public.employee_cash for delete
  using (auth.uid() = user_id);

-- Create unpaid_amounts table
create table public.unpaid_amounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  person_name text not null,
  amount numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.unpaid_amounts enable row level security;

create policy "Users can view own unpaid_amounts"
  on public.unpaid_amounts for select
  using (auth.uid() = user_id);

create policy "Users can insert own unpaid_amounts"
  on public.unpaid_amounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own unpaid_amounts"
  on public.unpaid_amounts for update
  using (auth.uid() = user_id);

create policy "Users can delete own unpaid_amounts"
  on public.unpaid_amounts for delete
  using (auth.uid() = user_id);

-- Create readings table
create table public.readings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  fuel_type text not null check (fuel_type in ('petrol', 'powerPetrol', 'diesel')),
  nozzle text not null,
  reading1 numeric(10,2) not null,
  reading2 numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.readings enable row level security;

create policy "Users can view own readings"
  on public.readings for select
  using (auth.uid() = user_id);

create policy "Users can insert own readings"
  on public.readings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own readings"
  on public.readings for update
  using (auth.uid() = user_id);

create policy "Users can delete own readings"
  on public.readings for delete
  using (auth.uid() = user_id);

-- Create notes table
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can view own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index sales_user_id_date_idx on public.sales(user_id, date);
create index earnings_user_id_date_idx on public.earnings(user_id, date);
create index expenses_user_id_date_idx on public.expenses(user_id, date);
create index employee_cash_user_id_date_idx on public.employee_cash(user_id, date);
create index unpaid_amounts_user_id_date_idx on public.unpaid_amounts(user_id, date);
create index readings_user_id_date_idx on public.readings(user_id, date);
create index notes_user_id_date_idx on public.notes(user_id, date);
