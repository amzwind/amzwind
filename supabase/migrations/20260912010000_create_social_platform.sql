-- ============================================================
-- AMAZON WIND - Social Platform Database
-- Phase 2: Friendships, Messaging, Groups, Notifications
-- ============================================================

-- ============================================================
-- 1. SOCIAL GRAPH: friendships
-- ============================================================

CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id <> friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own friendships" ON friendships;
CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can create friendships" ON friendships;
CREATE POLICY "Users can create friendships"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own friendships" ON friendships;
CREATE POLICY "Users can delete own friendships"
  ON friendships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================================
-- 2. SOCIAL GRAPH: friend_requests
-- ============================================================

CREATE TYPE friend_request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friend_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id <> receiver_id)
);

CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id) WHERE status = 'pending';
CREATE INDEX idx_friend_requests_sender ON friend_requests(sender_id);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own friend requests" ON friend_requests;
CREATE POLICY "Users can view own friend requests"
  ON friend_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
CREATE POLICY "Users can send friend requests"
  ON friend_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own friend requests" ON friend_requests;
CREATE POLICY "Users can update own friend requests"
  ON friend_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- ============================================================
-- 3. MESSAGING: conversations
-- ============================================================

CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'trip');

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type conversation_type NOT NULL DEFAULT 'direct',
  name TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view conversations" ON conversations;
CREATE POLICY "Members can view conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = conversations.id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Conversation creators can update" ON conversations;
CREATE POLICY "Conversation creators can update"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================
-- 4. MESSAGING: conversation_members
-- ============================================================

CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE IF NOT EXISTS conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  muted BOOLEAN NOT NULL DEFAULT false,
  archived BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_members_user ON conversation_members(user_id);
CREATE INDEX idx_conv_members_conversation ON conversation_members(conversation_id);

ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view conversation members" ON conversation_members;
CREATE POLICY "Members can view conversation members"
  ON conversation_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id AND cm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Conversation creators can add members" ON conversation_members;
CREATE POLICY "Conversation creators can add members"
  ON conversation_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_members.conversation_id AND c.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Members can update own membership" ON conversation_members;
CREATE POLICY "Members can update own membership"
  ON conversation_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can remove members" ON conversation_members;
CREATE POLICY "Owners can remove members"
  ON conversation_members FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'owner'
    )
  );

-- ============================================================
-- 5. MESSAGING: messages
-- ============================================================

CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'audio', 'gif', 'sticker', 'file', 'post', 'trip', 'system');

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  forwarded_from_id UUID REFERENCES messages(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_reply ON messages(reply_to_id) WHERE reply_to_id IS NOT NULL;
CREATE INDEX idx_messages_expires ON messages(expires_at) WHERE expires_at IS NOT NULL;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view messages" ON messages;
CREATE POLICY "Members can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    AND (expires_at IS NULL OR expires_at > now())
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can send messages" ON messages;
CREATE POLICY "Members can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Senders can update own messages" ON messages;
CREATE POLICY "Senders can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Senders can soft-delete own messages" ON messages;
CREATE POLICY "Senders can soft-delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- ============================================================
-- 6. MESSAGING: message_reactions
-- ============================================================

CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

CREATE INDEX idx_msg_reactions_message ON message_reactions(message_id);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view reactions" ON message_reactions;
CREATE POLICY "Members can view reactions"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_reactions.message_id AND cm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can add reactions" ON message_reactions;
CREATE POLICY "Members can add reactions"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own reactions" ON message_reactions;
CREATE POLICY "Users can remove own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. MESSAGING: message_attachments
-- ============================================================

CREATE TYPE attachment_type AS ENUM ('image', 'video', 'audio', 'gif', 'sticker', 'file');

CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  type attachment_type NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  width INT,
  height INT,
  duration INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_msg_attachments_message ON message_attachments(message_id);

ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view attachments" ON message_attachments;
CREATE POLICY "Members can view attachments"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id AND cm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can create attachments" ON message_attachments;
CREATE POLICY "Members can create attachments"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- 8. GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_conversation ON groups(conversation_id);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view groups" ON groups;
CREATE POLICY "Members can view groups"
  ON groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = groups.conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create groups" ON groups;
CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Group creators can update" ON groups;
CREATE POLICY "Group creators can update"
  ON groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================
-- 9. TRIP GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS trip_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trip_date TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trip_groups_experience ON trip_groups(experience_id);
CREATE INDEX idx_trip_groups_conversation ON trip_groups(conversation_id);

ALTER TABLE trip_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trip participants can view trip groups" ON trip_groups;
CREATE POLICY "Trip participants can view trip groups"
  ON trip_groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = trip_groups.conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can create trip groups" ON trip_groups;
CREATE POLICY "Admins can create trip groups"
  ON trip_groups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 10. STICKERS
-- ============================================================

CREATE TABLE IF NOT EXISTS sticker_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES sticker_packs(id) ON DELETE CASCADE,
  name TEXT,
  media_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stickers_pack ON stickers(pack_id);

ALTER TABLE sticker_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sticker packs" ON sticker_packs;
CREATE POLICY "Anyone can view sticker packs"
  ON sticker_packs FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can view stickers" ON stickers;
CREATE POLICY "Anyone can view stickers"
  ON stickers FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 11. NOTIFICATIONS
-- ============================================================

CREATE TYPE notification_type AS ENUM (
  'friend_request', 'friend_accepted', 'new_message',
  'mention', 'reaction', 'comment', 'share',
  'group_invite', 'trip_invite', 'group_message'
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  content TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE read = false;
CREATE INDEX idx_notifications_user_all ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 12. POST SHARES
-- ============================================================

CREATE TABLE IF NOT EXISTS post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_shares_post ON post_shares(post_id);
CREATE INDEX idx_post_shares_conversation ON post_shares(conversation_id) WHERE conversation_id IS NOT NULL;

ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own shares" ON post_shares;
CREATE POLICY "Users can view own shares"
  ON post_shares FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create shares" ON post_shares;
CREATE POLICY "Users can create shares"
  ON post_shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 13. TRIGGERS
-- ============================================================

-- Auto-update conversations.updated_at on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON messages;
CREATE TRIGGER trg_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- ============================================================
-- 14. RPC FUNCTIONS
-- ============================================================

-- Get or create direct conversation
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conv_id UUID;
  v_my_id UUID := auth.uid();
BEGIN
  IF v_my_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;

  -- Check existing direct conversation
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

  -- Create new conversation
  INSERT INTO conversations (type, created_by)
  VALUES ('direct', v_my_id)
  RETURNING id INTO v_conv_id;

  INSERT INTO conversation_members (conversation_id, user_id, role)
  VALUES (v_conv_id, v_my_id, 'owner'), (v_conv_id, other_user_id, 'member');

  RETURN v_conv_id;
END;
$$;

-- Send friend request
CREATE OR REPLACE FUNCTION send_friend_request(receiver_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_request_id UUID;
  v_exists BOOLEAN;
BEGIN
  IF v_sender_id = receiver_id THEN
    RAISE EXCEPTION 'Cannot send friend request to yourself';
  END IF;

  -- Check if already friends
  SELECT EXISTS(
    SELECT 1 FROM friendships WHERE user_id = v_sender_id AND friend_id = receiver_id
  ) INTO v_exists;

  IF v_exists THEN
    RAISE EXCEPTION 'Already friends';
  END IF;

  -- Check for existing pending request (either direction)
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

  -- Create notification
  INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id)
  VALUES (receiver_id, 'friend_request', v_sender_id, 'friend_request', v_request_id);

  RETURN v_request_id;
END;
$$;

-- Respond to friend request
CREATE OR REPLACE FUNCTION respond_friend_request(
  request_id UUID,
  accept BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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
    -- Create friendship (only one direction, policy handles both)
    INSERT INTO friendships (user_id, friend_id)
    VALUES (v_request.sender_id, v_request.receiver_id)
    ON CONFLICT DO NOTHING;

    UPDATE friend_requests SET status = 'accepted', responded_at = now() WHERE id = request_id;

    -- Notify sender
    INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id)
    VALUES (v_request.sender_id, 'friend_accepted', v_user_id, 'friend_request', request_id);
  ELSE
    UPDATE friend_requests SET status = 'rejected', responded_at = now() WHERE id = request_id;
  END IF;

  RETURN accept;
END;
$$;

-- Remove friendship
CREATE OR REPLACE FUNCTION remove_friend(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Toggle message reaction
CREATE OR REPLACE FUNCTION toggle_message_reaction(
  p_message_id UUID,
  p_reaction TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_as_read(p_conversation_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE conversation_members
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id AND user_id = auth.uid();
$$;

-- Pin/unpin message
CREATE OR REPLACE FUNCTION pin_message(p_message_id UUID, p_pin BOOLEAN)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE messages SET is_pinned = p_pin WHERE id = p_message_id;
$$;

-- Delete message (soft delete)
CREATE OR REPLACE FUNCTION delete_message(p_message_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_msg RECORD;
BEGIN
  SELECT * INTO v_msg FROM messages WHERE id = p_message_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Message not found';
  END IF;

  IF v_msg.sender_id <> auth.uid() THEN
    -- Check if user is owner/admin of conversation
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

-- Get user conversations with preview
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

-- Get conversation messages with pagination
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
  ORDER BY m.created_at DESC
  LIMIT LEAST(p_limit, 100);
$$;

-- Get unread counts for all conversations
CREATE OR REPLACE FUNCTION get_unread_counts()
RETURNS TABLE (
  conversation_id UUID,
  unread_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
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

-- Search users for adding to conversations/friends
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

-- ============================================================
-- 15. STORAGE BUCKETS
-- ============================================================

-- chat-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'audio/webm', 'audio/mpeg', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'audio/webm', 'audio/mpeg', 'audio/ogg'];

-- stickers bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stickers',
  'stickers',
  true,
  5242880,
  ARRAY['image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/webp', 'image/gif'];

-- chat-media storage policies
DROP POLICY IF EXISTS "Members can upload chat media" ON storage.objects;
CREATE POLICY "Members can upload chat media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chat-media');

DROP POLICY IF EXISTS "Members can view chat media" ON storage.objects;
CREATE POLICY "Members can view chat media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat-media');

DROP POLICY IF EXISTS "Uploaders can delete own chat media" ON storage.objects;
CREATE POLICY "Uploaders can delete own chat media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'chat-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- stickers storage policies
DROP POLICY IF EXISTS "Anyone can view stickers" ON storage.objects;
CREATE POLICY "Anyone can view stickers"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'stickers');

DROP POLICY IF EXISTS "Admins can manage stickers" ON storage.objects;
CREATE POLICY "Admins can manage stickers"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'stickers'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
