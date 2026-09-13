-- ============================================================
-- FASE 2: AMZ COMMUNITY — Database Enhancements
-- Complements existing feed tables (posts, post_likes, post_comments)
-- ============================================================

-- ============================================================
-- 1. ALTER TABLES: Add missing columns
-- ============================================================

-- posts: add comments_count, shares_count, updated_at
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_count INT NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS shares_count INT NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- post_comments: add parent_id (for future threading), updated_at
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ============================================================
-- 2. TRIGGERS: Auto-update counters
-- ============================================================

-- Trigger: auto-update comments_count on posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_post_comments_count ON post_comments;
CREATE TRIGGER trg_update_post_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Trigger: auto-update shares_count on posts
CREATE OR REPLACE FUNCTION update_post_shares_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET shares_count = GREATEST(0, shares_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_post_shares_count ON post_shares;
CREATE TRIGGER trg_update_post_shares_count
  AFTER INSERT OR DELETE ON post_shares
  FOR EACH ROW EXECUTE FUNCTION update_post_shares_count();

-- Trigger: auto-update updated_at on posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: auto-update updated_at on post_comments
DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. RPC: share_post (atomic share + count update)
-- ============================================================

CREATE OR REPLACE FUNCTION share_post(
  p_post_id UUID,
  p_conversation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_share_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify post exists
  IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  -- Check for duplicate share (same user, same post, same conversation)
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

-- ============================================================
-- 4. RPC: Enhanced get_posts_feed with author + counts
-- ============================================================

-- Drop and recreate get_posts_feed to include comment/share counts
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
  created_at TIMESTAMPTZ
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
    p.created_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- ============================================================
-- 5. RPC: get_post_comments with author info
-- ============================================================

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

-- ============================================================
-- 6. RPC: get_postAuthors (batch resolve authors for feed)
-- ============================================================

CREATE OR REPLACE FUNCTION get_post_authors(p_user_ids UUID[])
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT pr.id, pr.full_name, pr.avatar_url
  FROM profiles pr
  WHERE pr.id = ANY(p_user_ids);
$$;

-- ============================================================
-- 7. NOTIFICATIONS: Auto-generate on interactions
-- ============================================================

-- Notification on like
CREATE OR REPLACE FUNCTION notify_on_post_like()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_liker_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  -- Don't notify self
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_on_post_like ON post_likes;
CREATE TRIGGER trg_notify_on_post_like
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION notify_on_post_like();

-- Notification on comment
CREATE OR REPLACE FUNCTION notify_on_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_commenter_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  -- Don't notify self
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_on_post_comment ON post_comments;
CREATE TRIGGER trg_notify_on_post_comment
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_post_comment();

-- Notification on share
CREATE OR REPLACE FUNCTION notify_on_post_share()
RETURNS TRIGGER AS $$
DECLARE
  v_post_owner UUID;
  v_sharer_name TEXT;
BEGIN
  SELECT user_id INTO v_post_owner FROM posts WHERE id = NEW.post_id;

  -- Don't notify self
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_on_post_share ON post_shares;
CREATE TRIGGER trg_notify_on_post_share
  AFTER INSERT ON post_shares
  FOR EACH ROW EXECUTE FUNCTION notify_on_post_share();

-- ============================================================
-- 8. INDEXES: Additional performance indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_posts_comments_count ON posts(comments_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_shares_count ON posts(shares_count DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON post_comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_post_shares_user ON post_shares(user_id);
