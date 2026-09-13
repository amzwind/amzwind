-- ============================================================
-- FASE 3 — Trips Foundation + Community Polish
-- ============================================================

-- ============================================================
-- 1. TRIPS TABLE
-- ============================================================

CREATE TYPE trip_status AS ENUM (
  'draft', 'published', 'full', 'cancelled', 'completed'
);

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_url TEXT,
  status trip_status NOT NULL DEFAULT 'draft',
  max_participants INT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trips_slug ON trips(slug) WHERE slug IS NOT NULL;

-- ============================================================
-- 2. TRIP PARTICIPANTS
-- ============================================================

CREATE TYPE trip_role AS ENUM ('organizer', 'participant');
CREATE TYPE trip_member_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE IF NOT EXISTS trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role trip_role NOT NULL DEFAULT 'participant',
  status trip_member_status NOT NULL DEFAULT 'confirmed',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

CREATE INDEX idx_trip_participants_trip ON trip_participants(trip_id);
CREATE INDEX idx_trip_participants_user ON trip_participants(user_id);

-- ============================================================
-- 3. TRIP ↔ CONVERSATION LINK
-- ============================================================

ALTER TABLE trip_groups ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES trips(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_trip_groups_trip ON trip_groups(trip_id) WHERE trip_id IS NOT NULL;

-- ============================================================
-- 4. POST ↔ TRIP LINK (optional)
-- ============================================================

ALTER TABLE posts ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES trips(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_posts_trip ON posts(trip_id) WHERE trip_id IS NOT NULL;

-- ============================================================
-- 5. TRIGGERS: updated_at on trips
-- ============================================================

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. RPC: get_friends_feed
-- ============================================================

CREATE OR REPLACE FUNCTION get_friends_feed(
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  media_url TEXT,
  likes_count INT,
  comments_count INT,
  shares_count INT,
  liked_by_me BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.user_id,
    p.content,
    p.media_url,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    EXISTS(
      SELECT 1 FROM post_likes pl
      WHERE pl.post_id = p.id AND pl.user_id = auth.uid()
    ) AS liked_by_me,
    p.created_at,
    p.updated_at
  FROM posts p
  WHERE p.user_id = auth.uid()
     OR p.user_id IN (
       SELECT CASE
         WHEN fr.sender_id = auth.uid() THEN fr.receiver_id
         WHEN fr.receiver_id = auth.uid() THEN fr.sender_id
       END
       FROM friendships fr
       WHERE fr.status = 'accepted'
         AND (fr.sender_id = auth.uid() OR fr.receiver_id = auth.uid())
     )
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 7. UPDATE get_posts_feed to include updated_at
-- ============================================================

DROP FUNCTION IF EXISTS get_posts_feed(INT, INT);

CREATE OR REPLACE FUNCTION get_posts_feed(
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  media_url TEXT,
  likes_count INT,
  comments_count INT,
  shares_count INT,
  liked_by_me BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.user_id,
    p.content,
    p.media_url,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    EXISTS(
      SELECT 1 FROM post_likes pl
      WHERE pl.post_id = p.id AND pl.user_id = auth.uid()
    ) AS liked_by_me,
    p.created_at,
    p.updated_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 8. RPC: list_trips (with participant count)
-- ============================================================

CREATE OR REPLACE FUNCTION list_trips(
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0,
  p_status trip_status DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_url TEXT,
  status trip_status,
  max_participants INT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  participant_count BIGINT,
  is_participant BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    t.id,
    t.title,
    t.slug,
    t.description,
    t.destination,
    t.start_date,
    t.end_date,
    t.cover_url,
    t.status,
    t.max_participants,
    t.created_by,
    t.created_at,
    t.updated_at,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count,
    EXISTS(SELECT 1 FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.user_id = auth.uid() AND tp.status = 'confirmed') AS is_participant
  FROM trips t
  WHERE t.status = 'published'
    AND (p_status IS NULL OR t.status = p_status)
  ORDER BY t.start_date ASC NULLS LAST, t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 9. RPC: get_trip (single trip with participants)
-- ============================================================

CREATE OR REPLACE FUNCTION get_trip(p_trip_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_url TEXT,
  status trip_status,
  max_participants INT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  participant_count BIGINT,
  is_participant BOOLEAN,
  creator_name TEXT,
  creator_avatar TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    t.id,
    t.title,
    t.slug,
    t.description,
    t.destination,
    t.start_date,
    t.end_date,
    t.cover_url,
    t.status,
    t.max_participants,
    t.created_by,
    t.created_at,
    t.updated_at,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count,
    EXISTS(SELECT 1 FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.user_id = auth.uid() AND tp.status = 'confirmed') AS is_participant,
    p.full_name AS creator_name,
    p.avatar_url AS creator_avatar
  FROM trips t
  LEFT JOIN profiles p ON p.id = t.created_by
  WHERE t.id = p_trip_id;
$$;

-- ============================================================
-- 10. RPC: join_trip
-- ============================================================

CREATE OR REPLACE FUNCTION join_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip trips%ROWTYPE;
  v_exists BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.status != 'published' THEN
    RAISE EXCEPTION 'Trip is not available for joining';
  END IF;

  IF v_trip.max_participants IS NOT NULL THEN
    IF (SELECT count(*) FROM trip_participants WHERE trip_id = p_trip_id AND status = 'confirmed') >= v_trip.max_participants THEN
      RAISE EXCEPTION 'Trip is full';
    END IF;
  END IF;

  SELECT EXISTS(SELECT 1 FROM trip_participants WHERE trip_id = p_trip_id AND user_id = v_user_id) INTO v_exists;

  IF v_exists THEN
    UPDATE trip_participants SET status = 'confirmed' WHERE trip_id = p_trip_id AND user_id = v_user_id;
  ELSE
    INSERT INTO trip_participants (trip_id, user_id, role, status) VALUES (p_trip_id, v_user_id, 'participant', 'confirmed');
  END IF;
END;
$$;

-- ============================================================
-- 11. RPC: leave_trip
-- ============================================================

CREATE OR REPLACE FUNCTION leave_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS(SELECT 1 FROM trips WHERE id = p_trip_id AND created_by = v_user_id) THEN
    DELETE FROM trip_participants WHERE trip_id = p_trip_id AND user_id = v_user_id AND role != 'organizer';
    IF NOT FOUND THEN
      RAISE EXCEPTION 'You are not a participant of this trip';
    END IF;
  ELSE
    RAISE EXCEPTION 'Organizer cannot leave their own trip';
  END IF;
END;
$$;

-- ============================================================
-- 12. RPC: create_trip (creates trip + adds organizer)
-- ============================================================

CREATE OR REPLACE FUNCTION create_trip(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_destination TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_max_participants INT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip_id UUID;
  v_slug TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug) || '-' || substr(gen_random_uuid()::text, 1, 8);

  INSERT INTO trips (title, slug, description, destination, start_date, end_date, max_participants, created_by, status)
  VALUES (p_title, v_slug, p_description, p_destination, p_start_date, p_end_date, p_max_participants, v_user_id, 'published')
  RETURNING id INTO v_trip_id;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip_id, v_user_id, 'organizer', 'confirmed');

  RETURN v_trip_id;
END;
$$;

-- ============================================================
-- 13. RLS: trips
-- ============================================================

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view published trips" ON trips;
CREATE POLICY "Authenticated users can view published trips"
  ON trips FOR SELECT
  TO authenticated
  USING (status = 'published' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create trips" ON trips;
CREATE POLICY "Authenticated users can create trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Organizers can update own trips" ON trips;
CREATE POLICY "Organizers can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Organizers can delete own trips" ON trips;
CREATE POLICY "Organizers can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================
-- 14. RLS: trip_participants
-- ============================================================

ALTER TABLE trip_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view trip participants" ON trip_participants;
CREATE POLICY "Users can view trip participants"
  ON trip_participants FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can join trips" ON trip_participants;
CREATE POLICY "Users can join trips"
  ON trip_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own participation" ON trip_participants;
CREATE POLICY "Users can update own participation"
  ON trip_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave trips" ON trip_participants;
CREATE POLICY "Users can leave trips"
  ON trip_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
