-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid references auth.users not null primary key,
  nama text not null,
  email text not null,
  role text not null check (role in ('admin', 'staf')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can update users" ON public.users;
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;

-- Allow insert from anywhere (we will use a trigger instead, but keep this for manual inserts if needed)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (true);

-- Allow all authenticated users to view users (prevents infinite recursion)
CREATE POLICY "Enable read access for authenticated users" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Function to check if current user is admin safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  status boolean;
BEGIN
  -- We use auth.uid() directly on the users table.
  -- Since the SELECT policy no longer relies on is_admin(), this is safe from recursion.
  SELECT role = 'admin' INTO status FROM public.users WHERE id = auth.uid();
  RETURN coalesce(status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE POLICY "Admin can insert users" ON public.users
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update users" ON public.users
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete users" ON public.users
  FOR DELETE USING (public.is_admin());

-- Create alat_medis table
CREATE TABLE IF NOT EXISTS public.alat_medis (
  id uuid default gen_random_uuid() primary key,
  nama_alat text not null,
  jenis_alat text not null,
  jumlah integer not null default 0,
  status text not null,
  catatan text,
  input_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.alat_medis ENABLE ROW LEVEL SECURITY;

-- Policies for alat_medis
CREATE POLICY "Users can view alat_medis" ON public.alat_medis
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert alat_medis" ON public.alat_medis
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update alat_medis" ON public.alat_medis
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete alat_medis" ON public.alat_medis
  FOR DELETE USING (public.is_admin());

-- Create log_laporan table
CREATE TABLE IF NOT EXISTS public.log_laporan (
  id uuid default gen_random_uuid() primary key,
  alat_id uuid references public.alat_medis(id) on delete cascade not null,
  tipe_transaksi text not null check (tipe_transaksi in ('masuk', 'keluar', 'rusak')),
  jumlah integer not null,
  petugas_id uuid references public.users(id) not null,
  waktu_lapor timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.log_laporan ENABLE ROW LEVEL SECURITY;

-- Policies for log_laporan
CREATE POLICY "Users can view log_laporan" ON public.log_laporan
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert log_laporan" ON public.log_laporan
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to handle new user signup automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, nama, email, role)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)), new.email, coalesce(new.raw_user_meta_data->>'role', 'staf'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
