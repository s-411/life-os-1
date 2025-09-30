-- Fix MITs RLS policy to allow inserts with automatic user_id
-- The issue: WITH CHECK clause requires user_id to match auth.uid(),
-- but we need to allow inserts where user_id is set automatically

DROP POLICY IF EXISTS "Users can manage own mits" ON mits;

-- Separate policies for different operations
CREATE POLICY "Users can view own mits" ON mits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mits" ON mits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mits" ON mits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mits" ON mits
  FOR DELETE
  USING (auth.uid() = user_id);
