-- ============================================================
-- FASE 5.7: Trip Security Fixes
-- Visibility, Admin Authorization, Cover Cleanup, Delete Cascade
-- ============================================================

-- ============================================================
-- 1. SCHEMA: Add visibility to trips
-- ============================================================

DO $$ BEGIN
  CREATE TYPE trip_visibility AS ENUM ('public', 'private');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE trips ADD COLUMN IF NOT EXISTS visibility trip_visibility NOT NULL DEFAULT 'public';

-- ============================================================
-- 2. UPDATE: create_trip — accept visibility param
-- ============================================================

CREATE OR REPLACE FUNCTION create_trip(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_destination TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_max_participants INT DEFAULT NULL,
  p_visibility trip_visibility DEFAULT 'public'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  INSERT INTO trips (title, slug, description, destination, start_date, end_date, max_participants, created_by, status, visibility)
  VALUES (p_title, v_slug, p_description, p_destination, p_start_date, p_end_date, p_max_participants, v_user_id, 'published', p_visibility)
  RETURNING id INTO v_trip_id;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip_id, v_user_id, 'organizer', 'confirmed');

  RETURN v_trip_id;
END;
$$;

-- ============================================================
-- 3. UPDATE: update_trip — accept visibility param
-- ============================================================

CREATE OR REPLACE FUNCTION update_trip(
  p_trip_id UUID,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_destination TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_max_participants INT DEFAULT NULL,
  p_cover_url TEXT DEFAULT NULL,
  p_status trip_status DEFAULT NULL,
  p_visibility trip_visibility DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip trips%ROWTYPE;
  v_current_participants INT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.created_by != v_user_id THEN
    RAISE EXCEPTION 'Only the organizer can edit this trip';
  END IF;

  IF p_max_participants IS NOT NULL THEN
    SELECT count(*) INTO v_current_participants
    FROM trip_participants
    WHERE trip_id = p_trip_id AND status = 'confirmed';

    IF p_max_participants < v_current_participants THEN
      RAISE EXCEPTION 'Cannot reduce max participants below current count (%)', v_current_participants;
    END IF;
  END IF;

  UPDATE trips SET
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    destination = COALESCE(p_destination, destination),
    start_date = COALESCE(p_start_date, start_date),
    end_date = COALESCE(p_end_date, end_date),
    max_participants = COALESCE(p_max_participants, max_participants),
    cover_url = COALESCE(p_cover_url, cover_url),
    status = COALESCE(p_status, status),
    visibility = COALESCE(p_visibility, visibility),
    updated_at = now()
  WHERE id = p_trip_id;
END;
$$;

-- ============================================================
-- 4. UPDATE: list_trips — respect visibility
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
  visibility trip_visibility,
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
SET search_path = public
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
    t.visibility,
    t.max_participants,
    t.created_by,
    t.created_at,
    t.updated_at,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count,
    EXISTS(SELECT 1 FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.user_id = auth.uid() AND tp.status = 'confirmed') AS is_participant
  FROM trips t
  WHERE t.status = 'published'
    AND t.visibility = 'public'
    AND (p_status IS NULL OR t.status = p_status)
  ORDER BY t.start_date ASC NULLS LAST, t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 5. UPDATE: get_trip — enforce visibility
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
  visibility trip_visibility,
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
SET search_path = public
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
    t.visibility,
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
  WHERE t.id = p_trip_id
    AND (
      t.visibility = 'public'
      OR t.created_by = auth.uid()
      OR EXISTS(SELECT 1 FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.user_id = auth.uid())
    );
$$;

-- ============================================================
-- 6. UPDATE: list_user_trips — include private trips user is in
-- ============================================================

CREATE OR REPLACE FUNCTION list_user_trips(
  p_user_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_url TEXT,
  status trip_status,
  visibility trip_visibility,
  participant_count BIGINT,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.title,
    t.slug,
    t.destination,
    t.start_date,
    t.end_date,
    t.cover_url,
    t.status,
    t.visibility,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count,
    tp.role::text,
    t.created_at
  FROM trips t
  JOIN trip_participants tp ON tp.trip_id = t.id AND tp.user_id = COALESCE(p_user_id, auth.uid())
  WHERE tp.status = 'confirmed'
  ORDER BY t.start_date ASC NULLS LAST, t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 7. RPC: admin_delete_trip — safe delete with storage cleanup
-- ============================================================

CREATE OR REPLACE FUNCTION admin_delete_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_cover_url TEXT;
  v_storage_path TEXT;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_caller_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can delete trips';
  END IF;

  SELECT cover_url INTO v_cover_url FROM trips WHERE id = p_trip_id;

  -- Delete storage file if exists
  IF v_cover_url IS NOT NULL THEN
    -- Extract path from URL: https://xxx.supabase.co/storage/v1/object/public/trip-covers/USER_ID/file.ext
    v_storage_path := regexp_replace(v_cover_url, '.*/trip-covers/', '');
    IF v_storage_path IS NOT NULL AND v_storage_path != v_cover_url THEN
      DELETE FROM storage.objects WHERE bucket_id = 'trip-covers' AND name = v_storage_path;
    END IF;
  END IF;

  -- Delete trip (cascades to trip_participants via FK)
  DELETE FROM trips WHERE id = p_trip_id;
END;
$$;

-- ============================================================
-- 8. RPC: admin_update_trip_status — admin status override
-- ============================================================

CREATE OR REPLACE FUNCTION admin_update_trip_status(
  p_trip_id UUID,
  p_status trip_status
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_caller_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can update trip status';
  END IF;

  UPDATE trips SET status = p_status, updated_at = now() WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;
END;
$$;

-- ============================================================
-- 9. RPC: admin_list_trips — list ALL trips for admin
-- ============================================================

CREATE OR REPLACE FUNCTION admin_list_trips(
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  destination TEXT,
  cover_url TEXT,
  status trip_status,
  visibility trip_visibility,
  max_participants INT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  participant_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.title,
    t.slug,
    t.destination,
    t.cover_url,
    t.status,
    t.visibility,
    t.max_participants,
    t.created_by,
    t.created_at,
    t.updated_at,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count
  FROM trips t
  ORDER BY t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 10. UPDATE: RLS — add visibility-aware policy for participants
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can view published trips" ON trips;
CREATE POLICY "Authenticated users can view published trips"
  ON trips FOR SELECT
  TO authenticated
  USING (
    (visibility = 'public' AND status = 'published')
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM trip_participants tp
      WHERE tp.trip_id = trips.id AND tp.user_id = auth.uid()
    )
  );

-- ============================================================
-- 11. UPDATE: create_trip_conversation — add participant check
-- ============================================================

CREATE OR REPLACE FUNCTION create_trip_conversation(p_trip_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip trips%ROWTYPE;
  v_conversation_id UUID;
  v_group_name TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.created_by != v_user_id THEN
    RAISE EXCEPTION 'Only the organizer can create the trip group';
  END IF;

  IF EXISTS (SELECT 1 FROM trip_groups WHERE trip_id = p_trip_id AND conversation_id IS NOT NULL) THEN
    SELECT conversation_id INTO v_conversation_id
    FROM trip_groups
    WHERE trip_id = p_trip_id AND conversation_id IS NOT NULL
    LIMIT 1;
    RETURN v_conversation_id;
  END IF;

  v_group_name := v_trip.title || ' — Trip';

  INSERT INTO conversations (type, name, created_by)
  VALUES ('trip', v_group_name, v_user_id)
  RETURNING id INTO v_conversation_id;

  INSERT INTO conversation_members (conversation_id, user_id, role)
  VALUES (v_conversation_id, v_user_id, 'owner');

  INSERT INTO trip_groups (trip_id, conversation_id, name, created_by)
  VALUES (p_trip_id, v_conversation_id, v_group_name, v_user_id);

  RETURN v_conversation_id;
END;
$$;

-- ============================================================
-- 12. TRIGGER: auto-delete trip_groups on trip delete
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_trip_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete trip_groups linked to this trip
  DELETE FROM trip_groups WHERE trip_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cleanup_trip_on_delete ON trips;
CREATE TRIGGER trg_cleanup_trip_on_delete
  BEFORE DELETE ON trips
  FOR EACH ROW EXECUTE FUNCTION cleanup_trip_on_delete();
