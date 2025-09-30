-- Create mits table for Most Important Things tracking
CREATE TABLE mits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, title)
);

-- Create index for efficient queries by user and date
CREATE INDEX idx_mits_user_date ON mits(user_id, date);

-- Enable Row Level Security
ALTER TABLE mits ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can manage only their own MITs
CREATE POLICY "Users can manage own mits" ON mits
  USING (auth.uid() = user_id);

-- Automatic updated_at trigger
CREATE TRIGGER update_mits_updated_at
  BEFORE UPDATE ON mits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
