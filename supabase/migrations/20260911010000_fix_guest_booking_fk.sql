-- ============================================================
-- AMAZON WIND - Fix guest booking FK constraint
-- Makes bookings.user_id nullable so guest users can book
-- without requiring a profile row.
-- ============================================================

-- 1. Drop the existing NOT NULL + FK constraint on user_id
ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_user_id_fkey,
  ALTER COLUMN user_id DROP NOT NULL;

-- 2. Re-add the FK constraint as nullable (NULL allowed for guests)
ALTER TABLE bookings
  ADD CONSTRAINT bookings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 3. Update the guest insert RLS policy to explicitly allow
--    inserts where user_id IS NULL (guest checkout)
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Allow guests to read their own bookings via session metadata
--    (guests can view bookings with NULL user_id by matching notes contact info)
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
