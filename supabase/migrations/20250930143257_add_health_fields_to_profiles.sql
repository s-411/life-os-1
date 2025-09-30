-- Add health-related fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bmr INTEGER,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  ADD COLUMN IF NOT EXISTS height NUMERIC(5,2), -- in cm
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2), -- in kg
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for new fields
COMMENT ON COLUMN public.profiles.bmr IS 'Basal Metabolic Rate in calories per day';
COMMENT ON COLUMN public.profiles.gender IS 'User gender: male, female, or other';
COMMENT ON COLUMN public.profiles.height IS 'User height in centimeters';
COMMENT ON COLUMN public.profiles.weight IS 'User weight in kilograms';
COMMENT ON COLUMN public.profiles.timezone IS 'User timezone (e.g., America/New_York)';