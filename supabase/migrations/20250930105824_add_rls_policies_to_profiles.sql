-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow users to view their own profile
CREATE POLICY "Allow individual read access"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Allow users to update their own profile
CREATE POLICY "Allow individual update access"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);