-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sales" ON public.sales
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales" ON public.sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales" ON public.sales
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales" ON public.sales
  FOR DELETE USING (auth.uid() = user_id);

-- Create earnings table
CREATE TABLE public.earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mode_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own earnings" ON public.earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own earnings" ON public.earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own earnings" ON public.earnings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own earnings" ON public.earnings
  FOR DELETE USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  item_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Create employee_cash table
CREATE TABLE public.employee_cash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('short', 'borrow', 'received', 'reward')),
  person_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employee_cash ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employee_cash" ON public.employee_cash
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employee_cash" ON public.employee_cash
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employee_cash" ON public.employee_cash
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own employee_cash" ON public.employee_cash
  FOR DELETE USING (auth.uid() = user_id);

-- Create unpaid_amounts table
CREATE TABLE public.unpaid_amounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  person_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.unpaid_amounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unpaid_amounts" ON public.unpaid_amounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unpaid_amounts" ON public.unpaid_amounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unpaid_amounts" ON public.unpaid_amounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own unpaid_amounts" ON public.unpaid_amounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create readings table
CREATE TABLE public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'powerPetrol', 'diesel')),
  nozzle TEXT NOT NULL,
  reading1 DECIMAL(10,2) NOT NULL,
  reading2 DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readings" ON public.readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings" ON public.readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings" ON public.readings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readings" ON public.readings
  FOR DELETE USING (auth.uid() = user_id);

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);