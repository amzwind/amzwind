-- ============================================================
-- FASE 8: Harden SECURITY DEFINER functions by locking search_path
-- ============================================================

-- post feed base functions
CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM post_likes WHERE post_id = p_post_id AND user_id = auth.uid()
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM post_likes WHERE post_id = p_post_id AND user_id = auth.uid();
    RETURN FALSE;
  ELSE
    INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, auth.uid());
    RETURN TRUE;
  END IF;
END;
$$;

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
  comments_count BIGINT,
  liked_by_me BOOLEAN,
  created_at TIMESTAMPTZ
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
    (SELECT count(*) FROM post_comments pc WHERE pc.post_id = p.id) AS comments_count,
    EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = auth.uid()) AS liked_by_me,
    p.created_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT LEAST(p_limit, 50)
  OFFSET p_offset;
$$;

-- social platform functions
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv_id UUID;
  v_my_id UUID := auth.uid();
BEGIN
  IF v_my_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  SELECT cm1.conversation_id INTO v_conv_id
  FROM conversation_members cm1
  JOIN conversation_members cm2 ON cm2.conversation_id = cm1.conversation_id
  JOIN conversations c ON c.id = cm1.conversation_id
  WHERE cm1.user_id = v_my_id
    AND cm2.user_id = other_user_id
    AND c.type = 'direct'
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  INSERT INTO conversations (type, created_by)
  VALUES ('direct', v_my_id)
  RETURNING id INTO v_conv_id;

  INSERT INTO conversation_members (conversation_id, user_id, role)
  VALUES (v_conv_id, v_my_id, 'owner'), (v_conv_id, other_user_id, 'member');

  RETURN v_conv_id;
END;
$$;

CREATE OR REPLACE FUNCTION send_friend_request(receiver_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_request_id UUID;
  v_exists BOOLEAN;
BEGIN
  IF v_sender_id = receiver_id THEN
    RAISE EXCEPTION 'Cannot send friend request to yourself';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM friendships WHERE user_id = v_sender_id AND friend_id = receiver_id
  ) INTO v_exists;

  IF v_exists THEN
    RAISE EXCEPTION 'Already friends';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM friend_requests
    WHERE ((sender_id = v_sender_id AND receiver_id = receiver_id)
        OR (sender_id = receiver_id AND receiver_id = v_sender_id))
      AND status = 'pending'
  ) INTO v_exists;

  IF v_exists THEN
    RAISE EXCEPTION 'Friend request already pending';
  END IF;

  INSERT INTO friend_requests (sender_id, receiver_id)
  VALUES (v_sender_id, receiver_id)
  RETURNING id INTO v_request_id;

  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id)
  VALUES (receiver_id, 'friend_request', v_sender_id, 'friend_request', v_request_id);

  RETURN v_request_id;
END;
$$;

CREATE OR REPLACE FUNCTION respond_friend_request(
  request_id UUID,
  accept BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request RECORD;
  v_user_id UUID := auth.uid();
BEGIN
  SELECT * INTO v_request FROM friend_requests WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  IF v_request.receiver_id <> v_user_id THEN
    RAISE EXCEPTION 'Not authorized to respond to this request';
  END IF;

  IF accept THEN
    INSERT INTO friendships (user_id, friend_id)
    VALUES (v_request.sender_id, v_request.receiver_id)
    ON CONFLICT DO NOTHING;

    UPDATE friend_requests SET status = 'accepted', responded_at = now() WHERE id = request_id;

    INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id)
    VALUES (v_request.sender_id, 'friend_accepted', v_user_id, 'friend_request', request_id);
  ELSE
    UPDATE friend_requests SET status = 'rejected', responded_at = now() WHERE id = request_id;
  END IF;

  RETURN accept;
END;
$$;

CREATE OR REPLACE FUNCTION remove_friend(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  DELETE FROM friendships
  WHERE (user_id = v_user_id AND friend_id = target_user_id)
     OR (user_id = target_user_id AND friend_id = v_user_id);

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION toggle_message_reaction(
  p_message_id UUID,
  p_reaction TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM message_reactions
    WHERE message_id = p_message_id AND user_id = v_user_id AND reaction = p_reaction
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM message_reactions
    WHERE message_id = p_message_id AND user_id = v_user_id AND reaction = p_reaction;
    RETURN false;
  ELSE
    INSERT INTO message_reactions (message_id, user_id, reaction)
    VALUES (p_message_id, v_user_id, p_reaction);
    RETURN true;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION mark_conversation_as_read(p_conversation_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE conversation_members
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id AND user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION pin_message(p_message_id UUID, p_pin BOOLEAN)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE messages SET is_pinned = p_pin WHERE id = p_message_id;
$$;

CREATE OR REPLACE FUNCTION delete_message(p_message_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_msg RECORD;
BEGIN
  SELECT * INTO v_msg FROM messages WHERE id = p_message_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Message not found';
  END IF;

  IF v_msg.sender_id <> auth.uid() THEN
    IF NOT EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = v_msg.conversation_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    ) THEN
      RAISE EXCEPTION 'Not authorized to delete this message';
    END IF;
  END IF;

  UPDATE messages SET deleted_at = now(), content = NULL, message_type = 'system' WHERE id = p_message_id;
  DELETE FROM message_attachments WHERE message_id = p_message_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_conversations()
RETURNS TABLE (
  conversation_id UUID,
  type conversation_type,
  name TEXT,
  avatar_url TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender UUID,
  unread_count BIGINT,
  member_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id AS conversation_id,
    c.type,
    COALESCE(c.name, (
      SELECT p.full_name FROM profiles p
      JOIN conversation_members cm ON cm.user_id = p.id
      WHERE cm.conversation_id = c.id AND cm.user_id <> auth.uid()
      LIMIT 1
    )) AS name,
    COALESCE(c.avatar_url, (
      SELECT p.avatar_url FROM profiles p
      JOIN conversation_members cm ON cm.user_id = p.id
      WHERE cm.conversation_id = c.id AND cm.user_id <> auth.uid()
      LIMIT 1
    )) AS avatar_url,
    m.content AS last_message,
    m.created_at AS last_message_at,
    m.sender_id AS last_message_sender,
    (SELECT count(*) FROM messages msg
     WHERE msg.conversation_id = c.id
       AND msg.created_at > cm_owner.last_read_at
       AND msg.sender_id <> auth.uid()
       AND msg.deleted_at IS NULL
       AND (msg.expires_at IS NULL OR msg.expires_at > now())
    ) AS unread_count,
    (SELECT count(*) FROM conversation_members WHERE conversation_id = c.id) AS member_count
  FROM conversations c
  JOIN conversation_members cm_owner ON cm_owner.conversation_id = c.id AND cm_owner.user_id = auth.uid()
  LEFT JOIN LATERAL (
    SELECT msg.content, msg.created_at, msg.sender_id
    FROM messages msg
    WHERE msg.conversation_id = c.id
      AND msg.deleted_at IS NULL
      AND (msg.expires_at IS NULL OR msg.expires_at > now())
    ORDER BY msg.created_at DESC
    LIMIT 1
  ) m ON true
  WHERE NOT cm_owner.archived
  ORDER BY COALESCE(m.created_at, c.created_at) DESC;
$$;

CREATE OR REPLACE FUNCTION get_conversation_messages(
  p_conversation_id UUID,
  p_limit INT DEFAULT 50,
  p_before TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  sender_name TEXT,
  sender_avatar TEXT,
  message_type message_type,
  content TEXT,
  created_at TIMESTAMPTZ,
  is_pinned BOOLEAN,
  reply_to_id UUID,
  reply_content TEXT,
  reply_sender_name TEXT,
  reactions JSONB,
  attachments JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.id,
    m.sender_id,
    COALESCE(p.full_name, 'Rider') AS sender_name,
    p.avatar_url AS sender_avatar,
    m.message_type,
    m.content,
    m.created_at,
    m.is_pinned,
    m.reply_to_id,
    rm.content AS reply_content,
    COALESCE(rp.full_name, 'Rider') AS reply_sender_name,
    COALESCE(
      (SELECT jsonb_object_agg(mr.reaction, mr.count)
       FROM (SELECT reaction, count(*) AS count FROM message_reactions WHERE message_id = m.id GROUP BY reaction) mr
      ), '{}'::jsonb
    ) AS reactions,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('id', ma.id, 'type', ma.type, 'url', ma.public_url, 'mime', ma.mime_type, 'size', ma.file_size, 'width', ma.width, 'height', ma.height, 'duration', ma.duration))
       FROM message_attachments ma WHERE ma.message_id = m.id
      ), '[]'::jsonb
    ) AS attachments
  FROM messages m
  LEFT JOIN profiles p ON p.id = m.sender_id
  LEFT JOIN messages rm ON rm.id = m.reply_to_id
  LEFT JOIN profiles rp ON rp.id = rm.sender_id
  WHERE m.conversation_id = p_conversation_id
    AND m.deleted_at IS NULL
    AND (m.expires_at IS NULL OR m.expires_at > now())
    AND (p_before IS NULL OR m.created_at < p_before)
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = p_conversation_id
        AND user_id = auth.uid()
    )
  ORDER BY m.created_at DESC
  LIMIT LEAST(p_limit, 100);
$$;

CREATE OR REPLACE FUNCTION get_unread_counts()
RETURNS TABLE (
  conversation_id UUID,
  unread_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cm.conversation_id,
    (SELECT count(*) FROM messages m
     WHERE m.conversation_id = cm.conversation_id
       AND m.created_at > cm.last_read_at
       AND m.sender_id <> auth.uid()
       AND m.deleted_at IS NULL
       AND (m.expires_at IS NULL OR m.expires_at > now())
    ) AS unread_count
  FROM conversation_members cm
  WHERE cm.user_id = auth.uid() AND NOT cm.archived;
$$;

CREATE OR REPLACE FUNCTION search_users(p_query TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  is_friend BOOLEAN,
  request_status TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pr.id,
    pr.full_name,
    pr.avatar_url,
    EXISTS(SELECT 1 FROM friendships WHERE (user_id = auth.uid() AND friend_id = pr.id) OR (user_id = pr.id AND friend_id = auth.uid())) AS is_friend,
    COALESCE(
      (SELECT fr.status::text FROM friend_requests fr
       WHERE ((fr.sender_id = auth.uid() AND fr.receiver_id = pr.id)
           OR (fr.sender_id = pr.id AND fr.receiver_id = auth.uid()))
         AND fr.status = 'pending'
       LIMIT 1
      ), CASE
        WHEN pr.id = auth.uid() THEN 'self'
        ELSE 'none'
      END
    ) AS request_status
  FROM profiles pr
  WHERE pr.id <> auth.uid()
    AND (
      pr.full_name ILIKE '%' || p_query || '%'
      OR pr.id::text = p_query
    )
  ORDER BY
    CASE WHEN pr.full_name ILIKE p_query || '%' THEN 0 ELSE 1 END,
    pr.full_name
  LIMIT 30;
$$;

-- community RPCs
CREATE OR REPLACE FUNCTION share_post(
  p_post_id UUID,
  p_conversation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_share_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  IF EXISTS (
    SELECT 1 FROM post_shares
    WHERE user_id = v_user_id
      AND post_id = p_post_id
      AND (conversation_id = p_conversation_id OR (conversation_id IS NULL AND p_conversation_id IS NULL))
  ) THEN
    RAISE EXCEPTION 'Already shared';
  END IF;

  INSERT INTO post_shares (post_id, user_id, conversation_id)
  VALUES (p_post_id, v_user_id, p_conversation_id)
  RETURNING id INTO v_share_id;

  RETURN v_share_id;
END;
$$;

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
  created_at TIMESTAMPTZ
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
    p.created_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

CREATE OR REPLACE FUNCTION get_post_comments(p_post_id UUID)
RETURNS TABLE (
  id UUID,
  post_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  parent_id UUID,
  author_name TEXT,
  author_avatar TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pc.id,
    pc.post_id,
    pc.user_id,
    pc.content,
    pc.created_at,
    pc.updated_at,
    pc.parent_id,
    COALESCE(p.full_name, 'Rider') AS author_name,
    p.avatar_url AS author_avatar
  FROM post_comments pc
  LEFT JOIN profiles p ON p.id = pc.user_id
  WHERE pc.post_id = p_post_id
  ORDER BY pc.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION get_post_authors(p_user_ids UUID[])
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
  SELECT pr.id, pr.full_name, pr.avatar_url
  FROM profiles pr
  WHERE pr.id = ANY(p_user_ids);
$$;

CREATE OR REPLACE FUNCTION notify_on_post_like()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_liker_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  IF v_post_owner = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO v_liker_name FROM profiles WHERE id = NEW.user_id;

  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id, content)
  VALUES (
    v_post_owner,
    'reaction',
    NEW.user_id,
    'post',
    NEW.post_id,
    COALESCE(v_liker_name, 'Alguém') || ' curtiu seu post'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_on_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_commenter_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  IF v_post_owner = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO v_commenter_name FROM profiles WHERE id = NEW.user_id;

  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id, content)
  VALUES (
    v_post_owner,
    'comment',
    NEW.user_id,
    'post',
    NEW.post_id,
    COALESCE(v_commenter_name, 'Alguém') || ' comentou no seu post'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_on_post_share()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_sharer_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  IF v_post_owner = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO v_sharer_name FROM profiles WHERE id = NEW.user_id;

  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id, content)
  VALUES (
    v_post_owner,
    'share',
    NEW.user_id,
    'post',
    NEW.post_id,
    COALESCE(v_sharer_name, 'Alguém') || ' compartilhou seu post'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- trips / community feed functions from earlier phases
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

  INSERT INTO trips (title, slug, description, destination, start_date, end_date, max_participants, created_by, status)
  VALUES (p_title, v_slug, p_description, p_destination, p_start_date, p_end_date, p_max_participants, v_user_id, 'published')
  RETURNING id INTO v_trip_id;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip_id, v_user_id, 'organizer', 'confirmed');

  RETURN v_trip_id;
END;
$$;
