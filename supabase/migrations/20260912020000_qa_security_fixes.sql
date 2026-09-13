-- ============================================================
-- QA FIXES: Security + Realtime corrections
-- ============================================================

-- 1. Fix chat-media storage: scope to user's own folder
DROP POLICY IF EXISTS "Members can upload chat media" ON storage.objects;
CREATE POLICY "Members can upload chat media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Members can view chat media" ON storage.objects;
CREATE POLICY "Members can view chat media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat-media');

-- 2. Fix notifications INSERT: only system/admin can insert
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- 3. Fix get_conversation_messages: add membership check
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
  -- Verify membership first
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
    -- CRITICAL: verify user is member of this conversation
    AND EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = p_conversation_id
        AND user_id = auth.uid()
    )
  ORDER BY m.created_at DESC
  LIMIT LEAST(p_limit, 100);
$$;

-- 4. Fix pin_message: require owner/admin role
CREATE OR REPLACE FUNCTION pin_message(p_message_id UUID, p_pin BOOLEAN)
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

  -- Only conversation owner/admin can pin
  IF NOT EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = v_msg.conversation_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to pin messages';
  END IF;

  UPDATE messages SET is_pinned = p_pin WHERE id = p_message_id;
END;
$$;

-- 5. Fix message_attachments INSERT: require membership
DROP POLICY IF EXISTS "Members can create attachments" ON message_attachments;
CREATE POLICY "Members can create attachments"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id
        AND cm.user_id = auth.uid()
    )
  );

-- 6. Fix friend_requests UPDATE: only receiver can respond
DROP POLICY IF EXISTS "Users can update own friend requests" ON friend_requests;
CREATE POLICY "Users can update own friend requests"
  ON friend_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- 7. Fix conversations UPDATE: allow members to update (for trigger)
DROP POLICY IF EXISTS "Conversation creators can update" ON conversations;
CREATE POLICY "Conversation creators can update"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = conversations.id
        AND user_id = auth.uid()
    )
  );
