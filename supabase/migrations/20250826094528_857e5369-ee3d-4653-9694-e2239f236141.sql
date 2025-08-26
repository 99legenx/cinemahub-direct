-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create analytics table for tracking
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  movie_id UUID,
  action TEXT NOT NULL, -- 'view', 'download', 'stream', 'search'
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create content approval table
CREATE TABLE public.content_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL,
  submitted_by UUID NOT NULL,
  reviewed_by UUID,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on content_approvals
ALTER TABLE public.content_approvals ENABLE ROW LEVEL SECURITY;

-- Create OTP table for 2FA
CREATE TABLE public.user_otp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL, -- 'login', 'verification'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_otp
ALTER TABLE public.user_otp ENABLE ROW LEVEL SECURITY;

-- Add content status to movies
ALTER TABLE public.movies ADD COLUMN status TEXT DEFAULT 'pending'; -- 'pending', 'approved', 'rejected'
ALTER TABLE public.movies ADD COLUMN approved_by UUID;
ALTER TABLE public.movies ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for analytics
CREATE POLICY "Admins can view all analytics"
ON public.analytics FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Anyone can insert analytics"
ON public.analytics FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create RLS policies for content_approvals
CREATE POLICY "Admins and moderators can view all approvals"
ON public.content_approvals FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins and moderators can manage approvals"
ON public.content_approvals FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Create RLS policies for user_otp
CREATE POLICY "Users can view their own OTP"
ON public.user_otp FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert OTP"
ON public.user_otp FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update movies RLS policies for admin management
CREATE POLICY "Admins can manage all movies"
ON public.movies FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Only show approved movies to regular users
DROP POLICY IF EXISTS "Movies are viewable by everyone" ON public.movies;
CREATE POLICY "Approved movies are viewable by everyone"
ON public.movies FOR SELECT
USING (status = 'approved' OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for movie uploads (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('movies', 'movies', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for movie uploads
CREATE POLICY "Admins can upload movies"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'movies' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator')));

CREATE POLICY "Admins can view movie files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'movies' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator')));

CREATE POLICY "Authenticated users can stream movies"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'movies');