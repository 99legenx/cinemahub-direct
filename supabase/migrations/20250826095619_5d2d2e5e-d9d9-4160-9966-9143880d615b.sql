-- Grant admin privileges to jeffp2213@gmail.com
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- First, try to find the user by email in auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'jeffp2213@gmail.com';
  
  -- If user exists, grant admin role
  IF target_user_id IS NOT NULL THEN
    -- Insert admin role if not already exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to existing user: jeffp2213@gmail.com';
  ELSE
    RAISE NOTICE 'User jeffp2213@gmail.com not found. Admin role will be granted when they sign up.';
  END IF;
END $$;

-- Create a function to auto-assign admin role to this specific email
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user is jeffp2213@gmail.com
  IF NEW.email = 'jeffp2213@gmail.com' THEN
    -- Remove default user role if it exists
    DELETE FROM public.user_roles 
    WHERE user_id = NEW.id AND role = 'user';
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log the admin assignment
    RAISE NOTICE 'Auto-assigned admin role to jeffp2213@gmail.com';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign admin role for jeffp2213@gmail.com
DROP TRIGGER IF EXISTS auto_assign_admin_role_trigger ON auth.users;
CREATE TRIGGER auto_assign_admin_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_role();