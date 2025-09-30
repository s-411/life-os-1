# Database Schema

## Complete PostgreSQL Schema (DDL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bmr INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height NUMERIC NOT NULL CHECK (height > 0),
  weight NUMERIC NOT NULL CHECK (weight > 0),
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily entries table
CREATE TABLE daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC CHECK (weight > 0),
  deep_work_completed BOOLEAN DEFAULT FALSE,
  winners_bible_morning BOOLEAN DEFAULT FALSE,
  winners_bible_night BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, date);

ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily entries" ON daily_entries
  USING (auth.uid() = user_id);

-- MITs table
CREATE TABLE mits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mits_user_date ON mits(user_id, date);

ALTER TABLE mits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mits" ON mits
  USING (auth.uid() = user_id);

-- Food entries table
CREATE TABLE food_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  carbs NUMERIC DEFAULT 0 CHECK (carbs >= 0),
  protein NUMERIC DEFAULT 0 CHECK (protein >= 0),
  fat NUMERIC DEFAULT 0 CHECK (fat >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_food_entries_user_date ON food_entries(user_id, date);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food entries" ON food_entries
  USING (auth.uid() = user_id);

-- Food templates table
CREATE TABLE food_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  carbs NUMERIC DEFAULT 0 CHECK (carbs >= 0),
  protein NUMERIC DEFAULT 0 CHECK (protein >= 0),
  fat NUMERIC DEFAULT 0 CHECK (fat >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE food_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food templates" ON food_templates
  USING (auth.uid() = user_id);

-- Exercise entries table
CREATE TABLE exercise_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  activity TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  calories_burned INTEGER NOT NULL CHECK (calories_burned >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exercise_entries_user_date ON exercise_entries(user_id, date);

ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercise entries" ON exercise_entries
  USING (auth.uid() = user_id);

-- Macro targets table
CREATE TABLE macro_targets (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  daily_calories INTEGER CHECK (daily_calories > 0),
  daily_carbs NUMERIC CHECK (daily_carbs >= 0),
  daily_protein NUMERIC CHECK (daily_protein >= 0),
  daily_fat NUMERIC CHECK (daily_fat >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE macro_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own macro targets" ON macro_targets
  USING (auth.uid() = user_id);

-- Injection compounds table
CREATE TABLE injection_compounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('mg', 'ml', 'mcg', 'IU')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE injection_compounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own injection compounds" ON injection_compounds
  USING (auth.uid() = user_id);

-- Injection entries table
CREATE TABLE injection_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  compound_id UUID NOT NULL REFERENCES injection_compounds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  dosage NUMERIC NOT NULL CHECK (dosage > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_injection_entries_user_date ON injection_entries(user_id, date);

ALTER TABLE injection_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own injection entries" ON injection_entries
  USING (auth.uid() = user_id);

-- Injection targets table
CREATE TABLE injection_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  compound_id UUID NOT NULL REFERENCES injection_compounds(id) ON DELETE CASCADE,
  weekly_dosage NUMERIC NOT NULL CHECK (weekly_dosage > 0),
  frequency_per_week INTEGER NOT NULL CHECK (frequency_per_week > 0 AND frequency_per_week <= 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, compound_id)
);

ALTER TABLE injection_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own injection targets" ON injection_targets
  USING (auth.uid() = user_id);

-- Nirvana session types table
CREATE TABLE nirvana_session_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE nirvana_session_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own nirvana session types" ON nirvana_session_types
  USING (auth.uid() = user_id);

-- Nirvana sessions table
CREATE TABLE nirvana_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type_id UUID NOT NULL REFERENCES nirvana_session_types(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nirvana_sessions_user_date ON nirvana_sessions(user_id, date);

ALTER TABLE nirvana_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own nirvana sessions" ON nirvana_sessions
  USING (auth.uid() = user_id);

-- Winners Bible images table
CREATE TABLE winners_bible_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 1 AND display_order <= 15),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, display_order)
);

ALTER TABLE winners_bible_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own winners bible images" ON winners_bible_images
  USING (auth.uid() = user_id);

-- Weekly reviews table
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  review_date DATE NOT NULL,
  objectives TEXT,
  accomplishments TEXT,
  observations TEXT,
  next_week_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_weekly_reviews_user_date ON weekly_reviews(user_id, week_start_date);

ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own weekly reviews" ON weekly_reviews
  USING (auth.uid() = user_id);

-- Lifestyle modules table (system-level configuration)
CREATE TABLE lifestyle_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('binary', 'counter', 'goal')),
  unit TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- No RLS on lifestyle_modules (read-only for all authenticated users)
ALTER TABLE lifestyle_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lifestyle modules" ON lifestyle_modules
  FOR SELECT USING (auth.role() = 'authenticated');

-- User module settings table
CREATE TABLE user_module_settings (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES lifestyle_modules(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  goal_value NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

ALTER TABLE user_module_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own module settings" ON user_module_settings
  USING (auth.uid() = user_id);

-- Module entries table
CREATE TABLE module_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES lifestyle_modules(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, date)
);

CREATE INDEX idx_module_entries_user_date ON module_entries(user_id, date);

ALTER TABLE module_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own module entries" ON module_entries
  USING (auth.uid() = user_id);

-- Automatic updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mits_updated_at BEFORE UPDATE ON mits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_injection_targets_updated_at BEFORE UPDATE ON injection_targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_macro_targets_updated_at BEFORE UPDATE ON macro_targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_reviews_updated_at BEFORE UPDATE ON weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_module_settings_updated_at BEFORE UPDATE ON user_module_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---
