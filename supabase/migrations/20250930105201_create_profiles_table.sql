-- Create the profiles table
-- This table will hold public-facing user data.
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  avatar_url TEXT,
  email TEXT
);

-- Set up comments on the table and columns
COMMENT ON TABLE public.profiles IS 'Public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal auth.users id.';

-- Create a function to handle new user signups
-- This function will be called by a trigger when a new user is added to auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to execute the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();