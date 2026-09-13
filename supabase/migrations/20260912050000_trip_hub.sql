-- ============================================================
-- FASE 4: AMZ TRIP HUB — Database Enhancements
-- ============================================================

-- ============================================================
-- 1. SCHEMA: Make trip_groups.experience_id nullable
-- ============================================================

ALTER TABLE trip_groups ALTER COLUMN experience_id DROP NOT NULL;

-- Unique partial index: one conversation per trip (ignores NULL trip_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_trip_groups_trip_unique
  ON trip_groups(trip_id) WHERE trip_id IS NOT NULL;

-- ============================================================
-- 2. STORAGE: trip-covers bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trip-covers',
  'trip-covers',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Organizers can upload trip covers" ON storage.objects;
CREATE POLICY "Organizers can upload trip covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'trip-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Public can view trip covers" ON storage.objects;
CREATE POLICY "Public can view trip covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trip-covers');

DROP POLICY IF EXISTS "Organizers can update own trip covers" ON storage.objects;
CREATE POLICY "Organizers can update own trip covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'trip-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Organizers can delete own trip covers" ON storage.objects;
CREATE POLICY "Organizers can delete own trip covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'trip-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 3. RPC: update_trip
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
  p_status trip_status DEFAULT NULL
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
    updated_at = now()
  WHERE id = p_trip_id;
END;
$$;

-- ============================================================
-- 4. RPC: create_trip_conversation
-- Creates a conversation of type 'trip', links via trip_groups,
-- adds organizer as conversation member
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

  -- Check if conversation already exists for this trip
  IF EXISTS (SELECT 1 FROM trip_groups WHERE trip_id = p_trip_id AND conversation_id IS NOT NULL) THEN
    SELECT conversation_id INTO v_conversation_id
    FROM trip_groups
    WHERE trip_id = p_trip_id AND conversation_id IS NOT NULL
    LIMIT 1;
    RETURN v_conversation_id;
  END IF;

  v_group_name := v_trip.title || ' — Trip';

  -- Create conversation
  INSERT INTO conversations (type, name, created_by)
  VALUES ('trip', v_group_name, v_user_id)
  RETURNING id INTO v_conversation_id;

  -- Add organizer as owner
  INSERT INTO conversation_members (conversation_id, user_id, role)
  VALUES (v_conversation_id, v_user_id, 'owner');

  -- Link via trip_groups
  INSERT INTO trip_groups (trip_id, conversation_id, name, created_by)
  VALUES (p_trip_id, v_conversation_id, v_group_name, v_user_id);

  RETURN v_conversation_id;
END;
$$;

-- ============================================================
-- 5. RPC: get_trip_conversation
-- Returns the conversation_id for a trip (if it exists)
-- ============================================================

CREATE OR REPLACE FUNCTION get_trip_conversation(p_trip_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  conversation_name TEXT,
  member_count BIGINT,
  is_member BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tg.conversation_id,
    c.name AS conversation_name,
    (SELECT count(*) FROM conversation_members cm WHERE cm.conversation_id = c.id) AS member_count,
    EXISTS(
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = c.id AND cm.user_id = auth.uid()
    ) AS is_member
  FROM trip_groups tg
  JOIN conversations c ON c.id = tg.conversation_id
  WHERE tg.trip_id = p_trip_id
    AND tg.conversation_id IS NOT NULL;
$$;

-- ============================================================
-- 6. RPC: join_trip_with_group
-- Atomic: join trip + add to conversation
-- ============================================================

CREATE OR REPLACE FUNCTION join_trip_with_group(p_trip_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip trips%ROWTYPE;
  v_conversation_id UUID;
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

  -- Join trip (or rejoin)
  SELECT EXISTS(SELECT 1 FROM trip_participants WHERE trip_id = p_trip_id AND user_id = v_user_id) INTO v_exists;

  IF v_exists THEN
    UPDATE trip_participants SET status = 'confirmed' WHERE trip_id = p_trip_id AND user_id = v_user_id;
  ELSE
    INSERT INTO trip_participants (trip_id, user_id, role, status) VALUES (p_trip_id, v_user_id, 'participant', 'confirmed');
  END IF;

  -- Add to conversation if it exists
  SELECT tg.conversation_id INTO v_conversation_id
  FROM trip_groups tg
  WHERE tg.trip_id = p_trip_id AND tg.conversation_id IS NOT NULL
  LIMIT 1;

  IF v_conversation_id IS NOT NULL THEN
    INSERT INTO conversation_members (conversation_id, user_id, role)
    VALUES (v_conversation_id, v_user_id, 'member')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END IF;

  RETURN v_conversation_id;
END;
$$;

-- ============================================================
-- 7. RPC: leave_trip_with_group
-- Atomic: leave trip + remove from conversation
-- ============================================================

CREATE OR REPLACE FUNCTION leave_trip_with_group(p_trip_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_conversation_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS(SELECT 1 FROM trips WHERE id = p_trip_id AND created_by = v_user_id) THEN
    RAISE EXCEPTION 'Organizer cannot leave their own trip';
  END IF;

  -- Leave trip
  DELETE FROM trip_participants WHERE trip_id = p_trip_id AND user_id = v_user_id AND role != 'organizer';

  -- Remove from conversation
  SELECT tg.conversation_id INTO v_conversation_id
  FROM trip_groups tg
  WHERE tg.trip_id = p_trip_id AND tg.conversation_id IS NOT NULL
  LIMIT 1;

  IF v_conversation_id IS NOT NULL THEN
    DELETE FROM conversation_members WHERE conversation_id = v_conversation_id AND user_id = v_user_id;
  END IF;
END;
$$;

-- ============================================================
-- 8. RPC: invite_to_trip
-- ============================================================

CREATE OR REPLACE FUNCTION invite_to_trip(
  p_trip_id UUID,
  p_friend_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_trip trips%ROWTYPE;
  v_inviter_name TEXT;
  v_notification_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  IF v_trip.created_by != v_user_id THEN
    RAISE EXCEPTION 'Only the organizer can send invitations';
  END IF;

  IF v_trip.status != 'published' THEN
    RAISE EXCEPTION 'Can only invite to published trips';
  END IF;

  IF p_friend_id = v_user_id THEN
    RAISE EXCEPTION 'Cannot invite yourself';
  END IF;

  IF EXISTS (
    SELECT 1 FROM trip_participants
    WHERE trip_id = p_trip_id AND user_id = p_friend_id AND status IN ('confirmed', 'pending')
  ) THEN
    RAISE EXCEPTION 'User is already a participant or has a pending invite';
  END IF;

  IF v_trip.max_participants IS NOT NULL THEN
    IF (SELECT count(*) FROM trip_participants WHERE trip_id = p_trip_id AND status = 'confirmed') >= v_trip.max_participants THEN
      RAISE EXCEPTION 'Trip is full';
    END IF;
  END IF;

  -- Add as pending participant
  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (p_trip_id, p_friend_id, 'participant', 'pending');

  -- Get inviter name
  SELECT full_name INTO v_inviter_name FROM profiles WHERE id = v_user_id;

  -- Create notification
  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id, content)
  VALUES (
    p_friend_id,
    'trip_invite',
    v_user_id,
    'trip',
    p_trip_id,
    COALESCE(v_inviter_name, 'Alguém') || ' te convidou para a trip "' || v_trip.title || '"'
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- ============================================================
-- 9. RPC: respond_trip_invite
-- ============================================================

CREATE OR REPLACE FUNCTION respond_trip_invite(
  p_trip_id UUID,
  p_accept BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_conversation_id UUID;
  v_participant_record trip_participants%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_participant_record
  FROM trip_participants
  WHERE trip_id = p_trip_id AND user_id = v_user_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending invitation found';
  END IF;

  IF p_accept THEN
    -- Accept: confirm participant
    UPDATE trip_participants SET status = 'confirmed' WHERE id = v_participant_record.id;

    -- Add to conversation if it exists
    SELECT tg.conversation_id INTO v_conversation_id
    FROM trip_groups tg
    WHERE tg.trip_id = p_trip_id AND tg.conversation_id IS NOT NULL
    LIMIT 1;

    IF v_conversation_id IS NOT NULL THEN
      INSERT INTO conversation_members (conversation_id, user_id, role)
      VALUES (v_conversation_id, v_user_id, 'member')
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END IF;

    -- Mark related notification as read
    UPDATE notifications SET read = true
    WHERE user_id = v_user_id
      AND type = 'trip_invite'
      AND entity_type = 'trip'
      AND entity_id = p_trip_id
      AND from_user_id IS NOT NULL;
  ELSE
    -- Decline: remove participant record
    DELETE FROM trip_participants WHERE id = v_participant_record.id;

    -- Mark notification as read
    UPDATE notifications SET read = true
    WHERE user_id = v_user_id
      AND type = 'trip_invite'
      AND entity_type = 'trip'
      AND entity_id = p_trip_id
      AND from_user_id IS NOT NULL;
  END IF;
END;
$$;

-- ============================================================
-- 10. RPC: remove_trip_participant
-- Organizer removes a participant
-- ============================================================

CREATE OR REPLACE FUNCTION remove_trip_participant(
  p_trip_id UUID,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_conversation_id UUID;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM trips WHERE id = p_trip_id AND created_by = v_caller_id) THEN
    RAISE EXCEPTION 'Only the organizer can remove participants';
  END IF;

  IF p_user_id = v_caller_id THEN
    RAISE EXCEPTION 'Cannot remove yourself. Use leave trip instead.';
  END IF;

  DELETE FROM trip_participants WHERE trip_id = p_trip_id AND user_id = p_user_id;

  -- Remove from conversation
  SELECT tg.conversation_id INTO v_conversation_id
  FROM trip_groups tg
  WHERE tg.trip_id = p_trip_id AND tg.conversation_id IS NOT NULL
  LIMIT 1;

  IF v_conversation_id IS NOT NULL THEN
    DELETE FROM conversation_members WHERE conversation_id = v_conversation_id AND user_id = p_user_id;
  END IF;
END;
$$;

-- ============================================================
-- 11. RPC: get_trip_feed
-- Posts associated with a specific trip
-- ============================================================

CREATE OR REPLACE FUNCTION get_trip_feed(
  p_trip_id UUID,
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
SET search_path = public
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
  WHERE p.trip_id = p_trip_id
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 12. RPC: get_trip_invitable_friends
-- Friends of the organizer that are not yet participants
-- ============================================================

CREATE OR REPLACE FUNCTION get_trip_invitable_friends(p_trip_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pr.id,
    pr.full_name,
    pr.avatar_url
  FROM profiles pr
  WHERE pr.id IN (
    SELECT CASE
      WHEN fr.sender_id = auth.uid() THEN fr.receiver_id
      WHEN fr.receiver_id = auth.uid() THEN fr.sender_id
    END
    FROM friendships fr
    WHERE fr.status = 'accepted'
      AND (fr.sender_id = auth.uid() OR fr.receiver_id = auth.uid())
  )
  AND pr.id NOT IN (
    SELECT tp.user_id FROM trip_participants tp
    WHERE tp.trip_id = p_trip_id AND tp.status IN ('confirmed', 'pending')
  )
  ORDER BY pr.full_name;
$$;

-- ============================================================
-- 13. RPC: list_user_trips
-- Trips the user is participating in or organizing
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
-- 14. UPDATE: get_posts_feed + get_friends_feed to include trip_id
-- ============================================================

DROP FUNCTION IF EXISTS get_posts_feed(INT, INT);
DROP FUNCTION IF EXISTS get_friends_feed(INT, INT);

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
  updated_at TIMESTAMPTZ,
  trip_id UUID
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
    p.updated_at,
    p.trip_id
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

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
  updated_at TIMESTAMPTZ,
  trip_id UUID
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
    p.updated_at,
    p.trip_id
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
