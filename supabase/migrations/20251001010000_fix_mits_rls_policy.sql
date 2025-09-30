-- Fix MITs RLS policy to allow INSERT/UPDATE operations
-- The previous policy only had USING clause which only applies to SELECT
-- We need WITH CHECK clause for INSERT/UPDATE operations

DROP POLICY IF EXISTS "Users can manage own mits" ON mits;

-- Create comprehensive RLS policy with both USING and WITH CHECK
CREATE POLICY "Users can manage own mits" ON mits
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
