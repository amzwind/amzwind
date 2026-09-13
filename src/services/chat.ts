import { supabase, type Tables } from './supabase'

export type Conversation = Tables<'conversations'>
export type ConversationMember = Tables<'conversation_members'>
export type Message = Tables<'messages'>
export type MessageAttachment = Tables<'message_attachments'>
export type FriendRequest = Tables<'friend_requests'>
export type Friendship = Tables<'friendships'>

export interface ConversationPreview {
  conversation_id: string
  type: 'direct' | 'group' | 'trip'
  name: string | null
  avatar_url: string | null
  last_message: string | null
  last_message_at: string | null
  last_message_sender: string | null
  unread_count: number
  member_count: number
}

export interface MessageWithMeta {
  id: string
  sender_id: string | null
  sender_name: string
  sender_avatar: string | null
  message_type: Message['message_type']
  content: string | null
  created_at: string
  is_pinned: boolean
  reply_to_id: string | null
  reply_content: string | null
  reply_sender_name: string | null
  reactions: Record<string, number>
  attachments: Array<{
    id: string
    type: string
    url: string
    mime: string
    size: number
    width: number | null
    height: number | null
    duration: number | null
  }>
}

export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  is_friend: boolean
  request_status: string
}

const CHAT_MEDIA_BUCKET = 'chat-media'

// ============================================================
// Conversations
// ============================================================

export async function getUserConversations(): Promise<ConversationPreview[]> {
  const { data, error } = await supabase.rpc('get_user_conversations')
  if (error) throw new Error('Falha ao carregar conversas: ' + error.message)
  return data ?? []
}

export async function getOrCreateDirectConversation(otherUserId: string): Promise<string> {
  const { data, error } = await supabase.rpc('get_or_create_direct_conversation', {
    other_user_id: otherUserId,
  })
  if (error) throw new Error('Falha ao criar conversa: ' + error.message)
  return data
}

// ============================================================
// Messages
// ============================================================

export async function getConversationMessages(
  conversationId: string,
  limit = 50,
  before?: string | null
): Promise<MessageWithMeta[]> {
  const { data, error } = await supabase.rpc('get_conversation_messages', {
    p_conversation_id: conversationId,
    p_limit: limit,
    p_before: before ?? null,
  })
  if (error) throw new Error('Falha ao carregar mensagens: ' + error.message)
  return data ?? []
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: Message['message_type'] = 'text',
  replyToId?: string | null
): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message_type: messageType,
      content,
      reply_to_id: replyToId ?? null,
    })
    .select()
    .single()

  if (error) throw new Error('Falha ao enviar mensagem: ' + error.message)
  return data
}

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_message', { p_message_id: messageId })
  if (error) throw new Error('Falha ao apagar mensagem: ' + error.message)
}

export async function pinMessage(messageId: string, pin: boolean): Promise<void> {
  const { error } = await supabase.rpc('pin_message', {
    p_message_id: messageId,
    p_pin: pin,
  })
  if (error) throw new Error('Falha ao fixar mensagem: ' + error.message)
}

export async function markAsRead(conversationId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_conversation_as_read', {
    p_conversation_id: conversationId,
  })
  if (error) throw new Error('Falha ao marcar como lida: ' + error.message)
}

// ============================================================
// Reactions
// ============================================================

export async function toggleReaction(messageId: string, reaction: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_message_reaction', {
    p_message_id: messageId,
    p_reaction: reaction,
  })
  if (error) throw new Error('Falha ao reagir: ' + error.message)
  return data
}

// ============================================================
// Attachments (media upload to chat)
// ============================================================

export async function uploadChatMedia(
  file: File,
  conversationId: string
): Promise<{ storagePath: string; publicUrl: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const ext = file.name.split('.').pop() ?? 'bin'
  const storagePath = `${conversationId}/${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(CHAT_MEDIA_BUCKET)
    .upload(storagePath, file, { upsert: false })

  if (uploadError) throw new Error('Falha ao enviar arquivo: ' + uploadError.message)

  const { data: urlData } = supabase.storage
    .from(CHAT_MEDIA_BUCKET)
    .getPublicUrl(storagePath)

  return { storagePath, publicUrl: urlData.publicUrl }
}

export async function createAttachment(
  messageId: string,
  type: MessageAttachment['type'],
  storagePath: string,
  publicUrl: string,
  mimeType: string,
  fileSize: number,
  dimensions?: { width?: number; height?: number; duration?: number }
): Promise<MessageAttachment> {
  const { data, error } = await supabase
    .from('message_attachments')
    .insert({
      message_id: messageId,
      type,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: mimeType,
      file_size: fileSize,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      duration: dimensions?.duration ?? null,
    })
    .select()
    .single()

  if (error) throw new Error('Falha ao registrar anexo: ' + error.message)
  return data
}

export async function sendMediaMessage(
  conversationId: string,
  file: File,
  messageType: Message['message_type'],
  replyToId?: string | null
): Promise<Message> {
  const { storagePath, publicUrl } = await uploadChatMedia(file, conversationId)
  const msg = await sendMessage(conversationId, file.name, messageType, replyToId)
  await createAttachment(msg.id, messageType as MessageAttachment['type'], storagePath, publicUrl, file.type, file.size)
  return msg
}

// ============================================================
// Friends
// ============================================================

export async function sendFriendRequest(receiverId: string): Promise<string> {
  const { data, error } = await supabase.rpc('send_friend_request', {
    receiver_id: receiverId,
  })
  if (error) throw new Error('Falha ao enviar pedido: ' + error.message)
  return data
}

export async function respondFriendRequest(
  requestId: string,
  accept: boolean
): Promise<boolean> {
  const { data, error } = await supabase.rpc('respond_friend_request', {
    request_id: requestId,
    accept,
  })
  if (error) throw new Error('Falha ao responder pedido: ' + error.message)
  return data
}

export async function removeFriend(targetUserId: string): Promise<void> {
  const { error } = await supabase.rpc('remove_friend', {
    target_user_id: targetUserId,
  })
  if (error) throw new Error('Falha ao remover amizade: ' + error.message)
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  const { data, error } = await supabase.rpc('search_users', { p_query: query })
  if (error) throw new Error('Falha ao buscar usuários: ' + error.message)
  return data ?? []
}

// ============================================================
// Unread counts
// ============================================================

export async function getUnreadCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('get_unread_counts')
  if (error) throw new Error('Falha ao carregar não lidos: ' + error.message)
  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    map[row.conversation_id] = row.unread_count
  }
  return map
}
