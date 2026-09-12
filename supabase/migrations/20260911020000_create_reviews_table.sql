-- ============================================================
-- AMAZON WIND - Experience Reviews System
-- ============================================================

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS experience_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_id UUID REFERENCES experience_reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_experience ON experience_reviews(experience_id);
CREATE INDEX idx_reviews_user ON experience_reviews(user_id);
CREATE INDEX idx_reviews_status ON experience_reviews(status);
CREATE INDEX idx_reviews_parent ON experience_reviews(parent_id);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON experience_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Enable RLS
ALTER TABLE experience_reviews ENABLE ROW LEVEL SECURITY;

-- 3. Public can read approved reviews
DROP POLICY IF EXISTS "Public can read approved reviews" ON experience_reviews;
CREATE POLICY "Public can read approved reviews"
  ON experience_reviews FOR SELECT
  USING (status = 'approved');

-- 4. Authenticated users can insert reviews
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON experience_reviews;
CREATE POLICY "Authenticated users can insert reviews"
  ON experience_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Users can update own pending reviews
DROP POLICY IF EXISTS "Users can update own pending reviews" ON experience_reviews;
CREATE POLICY "Users can update own pending reviews"
  ON experience_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

-- 6. Users can delete own pending reviews
DROP POLICY IF EXISTS "Users can delete own pending reviews" ON experience_reviews;
CREATE POLICY "Users can delete own pending reviews"
  ON experience_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

-- 7. Admins have full access
DROP POLICY IF EXISTS "Admins full access on reviews" ON experience_reviews;
CREATE POLICY "Admins full access on reviews"
  ON experience_reviews FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
