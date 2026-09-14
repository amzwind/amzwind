-- ============================================================
-- FASE 16: align trip RPC contract with product UI and DB schema
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_visibility') THEN
    CREATE TYPE trip_visibility AS ENUM ('public', 'private');
  END IF;
END $$;

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

  INSERT INTO trips (
    title,
    slug,
    description,
    destination,
    start_date,
    end_date,
    max_participants,
    visibility,
    created_by,
    status
  )
  VALUES (
    p_title,
    v_slug,
    p_description,
    p_destination,
    p_start_date,
    p_end_date,
    p_max_participants,
    COALESCE(p_visibility, 'public'),
    v_user_id,
    'published'
  )
  RETURNING id INTO v_trip_id;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip_id, v_user_id, 'organizer', 'confirmed');

  RETURN v_trip_id;
END;
$$;

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
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE trips
  SET
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
  WHERE id = p_trip_id AND created_by = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found or you are not the organizer';
  END IF;
END;
$$;

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
    EXISTS(
      SELECT 1
      FROM trip_participants tp
      WHERE tp.trip_id = t.id
        AND tp.user_id = auth.uid()
        AND tp.status = 'confirmed'
    ) AS is_participant
  FROM trips t
  WHERE t.status = 'published'
    AND (
      t.visibility = 'public'
      OR t.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM trip_participants tp
        WHERE tp.trip_id = t.id
          AND tp.user_id = auth.uid()
          AND tp.status = 'confirmed'
      )
    )
    AND (p_status IS NULL OR t.status = p_status)
  ORDER BY t.start_date ASC NULLS LAST, t.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

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
    EXISTS(
      SELECT 1
      FROM trip_participants tp
      WHERE tp.trip_id = t.id
        AND tp.user_id = auth.uid()
        AND tp.status = 'confirmed'
    ) AS is_participant,
    p.full_name AS creator_name,
    p.avatar_url AS creator_avatar
  FROM trips t
  LEFT JOIN profiles p ON p.id = t.created_by
  WHERE t.id = p_trip_id
    AND (
      t.visibility = 'public'
      OR t.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM trip_participants tp
        WHERE tp.trip_id = t.id
          AND tp.user_id = auth.uid()
          AND tp.status = 'confirmed'
      )
    );
$$;

CREATE OR REPLACE FUNCTION join_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    IF (
      SELECT count(*)
      FROM trip_participants
      WHERE trip_id = p_trip_id AND status = 'confirmed'
    ) >= v_trip.max_participants THEN
      RAISE EXCEPTION 'Trip is full';
    END IF;
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM trip_participants WHERE trip_id = p_trip_id AND user_id = v_user_id
  ) INTO v_exists;

  IF v_exists THEN
    UPDATE trip_participants
    SET status = 'confirmed', joined_at = now()
    WHERE trip_id = p_trip_id AND user_id = v_user_id;
  ELSE
    INSERT INTO trip_participants (trip_id, user_id, role, status)
    VALUES (p_trip_id, v_user_id, 'participant', 'confirmed');
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION leave_trip(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM trips WHERE id = p_trip_id AND created_by = v_user_id) THEN
    RAISE EXCEPTION 'Organizer cannot leave their own trip';
  END IF;

  DELETE FROM trip_participants
  WHERE trip_id = p_trip_id
    AND user_id = v_user_id
    AND role != 'organizer';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'You are not a participant of this trip';
  END IF;
END;
$$;

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
