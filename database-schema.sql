-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum for app roles
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create user_roles table (separate from profiles for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Create sales table
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  ms_price decimal(10,2) default 0,
  ms_quantity decimal(10,2) default 0,
  ms_total decimal(10,2) default 0,
  hsd_price decimal(10,2) default 0,
  hsd_quantity decimal(10,2) default 0,
  hsd_total decimal(10,2) default 0,
  total_sales decimal(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create expenses table
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  oil decimal(10,2) default 0,
  wages decimal(10,2) default 0,
  electric_bill decimal(10,2) default 0,
  phone_bill decimal(10,2) default 0,
  others decimal(10,2) default 0,
  total_expenses decimal(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create earnings table
create table public.earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  cash decimal(10,2) default 0,
  upi decimal(10,2) default 0,
  card decimal(10,2) default 0,
  credit decimal(10,2) default 0,
  total_earnings decimal(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create employee_cash table
create table public.employee_cash (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  short_entries jsonb default '[]',
  borrow_entries jsonb default '[]',
  received_entries jsonb default '[]',
  reward_entries jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create readings table
create table public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  ms_nozzle1_open decimal(10,2) default 0,
  ms_nozzle1_close decimal(10,2) default 0,
  ms_nozzle1_sale decimal(10,2) default 0,
  ms_nozzle2_open decimal(10,2) default 0,
  ms_nozzle2_close decimal(10,2) default 0,
  ms_nozzle2_sale decimal(10,2) default 0,
  hsd_nozzle1_open decimal(10,2) default 0,
  hsd_nozzle1_close decimal(10,2) default 0,
  hsd_nozzle1_sale decimal(10,2) default 0,
  hsd_nozzle2_open decimal(10,2) default 0,
  hsd_nozzle2_close decimal(10,2) default 0,
  hsd_nozzle2_sale decimal(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create unpaid_amounts table
create table public.unpaid_amounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  previous_unpaid decimal(10,2) default 0,
  today_unpaid decimal(10,2) default 0,
  total_unpaid decimal(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Create notes table
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.sales enable row level security;
alter table public.expenses enable row level security;
alter table public.earnings enable row level security;
alter table public.employee_cash enable row level security;
alter table public.readings enable row level security;
alter table public.unpaid_amounts enable row level security;
alter table public.notes enable row level security;

-- Create security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for user_roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- RLS Policies for sales
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

-- RLS Policies for expenses
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

-- RLS Policies for earnings
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

-- RLS Policies for employee_cash
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

-- RLS Policies for readings
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

-- RLS Policies for unpaid_amounts
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

-- RLS Policies for notes
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
