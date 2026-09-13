-- Fix: friendships are represented by rows, not a status field.
-- The feed and invite RPCs were still filtering on friendships.status,
-- which does not exist in the actual schema.

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
         WHEN fr.user_id = auth.uid() THEN fr.friend_id
         WHEN fr.friend_id = auth.uid() THEN fr.user_id
         ELSE NULL
       END
       FROM friendships fr
       WHERE (fr.user_id = auth.uid() OR fr.friend_id = auth.uid())
     )
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

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
      WHEN fr.user_id = auth.uid() THEN fr.friend_id
      WHEN fr.friend_id = auth.uid() THEN fr.user_id
      ELSE NULL
    END
    FROM friendships fr
    WHERE (fr.user_id = auth.uid() OR fr.friend_id = auth.uid())
  )
  AND pr.id NOT IN (
    SELECT tp.user_id FROM trip_participants tp
    WHERE tp.trip_id = p_trip_id AND tp.status IN ('confirmed', 'pending')
  )
  ORDER BY pr.full_name;
$$;
