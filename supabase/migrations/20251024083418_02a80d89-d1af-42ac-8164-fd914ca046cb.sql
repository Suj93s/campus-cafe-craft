-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create menu table
CREATE TABLE public.menu (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  protein DECIMAL(5,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(5,2) NOT NULL DEFAULT 0,
  fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  image TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on menu (public read)
ALTER TABLE public.menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu"
  ON public.menu FOR SELECT
  USING (true);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_protein DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_carbs DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'qr',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert menu data
INSERT INTO public.menu (name, price, protein, carbs, fat, category) VALUES
  ('Uzhunnu Vada', 10, 2.5, 15, 3, 'snacks'),
  ('Cutlet', 15, 4, 20, 5, 'snacks'),
  ('Cream Bun', 20, 3, 30, 6, 'snacks'),
  ('Chicken Puffs', 25, 6, 18, 7, 'snacks'),
  ('Lays Red', 20, 2, 25, 10, 'snacks'),
  ('Dark Fantasy', 10, 2, 20, 7, 'snacks'),
  ('Amul Mango Lassi', 30, 5, 40, 8, 'beverages'),
  ('Tea', 10, 1, 5, 1, 'beverages'),
  ('Coffee', 15, 2, 3, 1, 'beverages'),
  ('Black Tea', 10, 0, 3, 0, 'beverages'),
  ('Smoodh Caramel', 25, 6, 25, 4, 'beverages'),
  ('Smoodh Hazelnut', 25, 6, 25, 5, 'beverages');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();