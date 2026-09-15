import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'
import {
  getConversationMessages,
  sendMessage,
  sendMediaMessage,
  toggleReaction,
  markAsRead,
  deleteMessage,
  type MessageWithMeta,
} from '../services/chat'
import MessageInput from '../components/chat/MessageInput'
import MessageBubble from '../components/chat/MessageBubble'
import {
  MOCK_CONVERSATIONS,
  DEMO_ME_ID,
  getMockMessages,
  type MockChatMessage,
} from '../data/community'

type Profile = Tables<'profiles'>

const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '🔥']

function buildDemoProfile(id: string, fullName: string, avatarUrl: string | null): Profile {
  const now = new Date().toISOString()
  return {
    id,
    full_name: fullName,
    bio: null,
    avatar_url: avatarUrl,
    phone: null,
    whatsapp: null,
    role: 'customer',
    created_at: now,
    updated_at: now,
  }
}

function toMessageWithMeta(m: MockChatMessage): MessageWithMeta {
  return {
    id: m.id,
    sender_id: m.sender_id,
    sender_name: m.sender_name,
    sender_avatar: m.sender_avatar,
    message_type: 'text',
    content: m.content,
    created_at: m.created_at,
    is_pinned: false,
    reply_to_id: null,
    reply_content: null,
    reply_sender_name: null,
    reactions: { ...m.reactions },
    attachments: [],
  }
}

export default function Chat() {
  const { id: conversationId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [messages, setMessages] = useState<MessageWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)
  const [replyTo, setReplyTo] = useState<MessageWithMeta | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ messageId: string; x: number; y: number } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const demoReactedRef = useRef<Set<string>>(new Set())

  // Conversas de demonstração (ids mock-conv-*): chat 100% local, sem banco
  const isDemo = (conversationId ?? '').startsWith('mock-conv-')

  const scrollToBottom = useCallback((smooth = true) => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    }
  }, [])

  useEffect(() => {
    if (!conversationId) return
    let cancelled = false

    async function init() {
      // Modo demonstração: monta o chat a partir do seed local
      if (isDemo) {
        const mock = MOCK_CONVERSATIONS.find((m) => m.conversation_id === conversationId)
        if (!cancelled) {
          setCurrentUser(buildDemoProfile(DEMO_ME_ID, 'Você', null))
          setOtherUser(
            mock
              ? buildDemoProfile(mock.rider_id, mock.name ?? 'Rider', mock.avatar_url)
              : buildDemoProfile('demo-rider', 'Rider', null)
          )
          setMessages(getMockMessages(conversationId!).map(toMessageWithMeta))
          setLoading(false)
          setTimeout(() => scrollToBottom(false), 50)
        }
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (!cancelled) setCurrentUser(profile)

      // Get other user for DM
      const { data: members } = await supabase
        .from('conversation_members')
        .select('user_id')
        .eq('conversation_id', conversationId!)
        .neq('user_id', user.id)

      if (!cancelled && members && members.length > 0) {
        const { data: other } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', members[0].user_id)
          .single()
        if (!cancelled) setOtherUser(other)
      }

      try {
        const msgs = await getConversationMessages(conversationId!)
        if (!cancelled) {
          setMessages(msgs)
          setLoading(false)
          setTimeout(() => scrollToBottom(false), 50)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [conversationId, isDemo, scrollToBottom])

  // Realtime subscription (desativado no modo demonstração)
  useEffect(() => {
    if (!conversationId || isDemo) return

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          // Refetch last 5 messages to avoid race conditions with rapid inserts
          const { data: fullMsgs } = await supabase.rpc('get_conversation_messages', {
            p_conversation_id: conversationId,
            p_limit: 5,
            p_before: null,
          })
          if (fullMsgs && fullMsgs.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((msg) => msg.id))
              const newMsgs = fullMsgs.filter((msg: MessageWithMeta) => !existingIds.has(msg.id))
              if (newMsgs.length === 0) return prev
              return [...prev, ...newMsgs]
            })
            scrollToBottom()
            markAsRead(conversationId).catch(() => {})
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const deletedId = payload.old?.id
          if (deletedId) {
            setMessages((prev) => prev.filter((m) => m.id !== deletedId))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as Tables<'messages'>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? { ...m, is_pinned: updated.is_pinned, content: updated.content, deleted_at: updated.deleted_at }
                : m
            )
          )
        }
      )
      .subscribe()

    markAsRead(conversationId).catch(() => {})

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, isDemo, scrollToBottom])

  // Scroll tracking
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = container!
      isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSend(text: string) {
    if (!conversationId || !text.trim() || sending) return
    if (isDemo) {
      const now = new Date().toISOString()
      setMessages((prev) => [
        ...prev,
        {
          id: `demo-${Date.now()}`,
          sender_id: DEMO_ME_ID,
          sender_name: 'Você',
          sender_avatar: null,
          message_type: 'text',
          content: text.trim(),
          created_at: now,
          is_pinned: false,
          reply_to_id: replyTo?.id ?? null,
          reply_content: replyTo?.content ?? null,
          reply_sender_name: replyTo?.sender_name ?? null,
          reactions: {},
          attachments: [],
        },
      ])
      setReplyTo(null)
      setTimeout(() => scrollToBottom(), 50)
      return
    }
    setSending(true)
    try {
      await sendMessage(conversationId, text.trim(), 'text', replyTo?.id ?? null)
      setReplyTo(null)
      scrollToBottom()
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  async function handleSendMedia(file: File, type: 'image' | 'video' | 'audio' | 'gif') {
    if (!conversationId || sending) return
    if (isDemo) {
      const now = new Date().toISOString()
      const mediaType = type === 'video' ? 'video' : type === 'audio' ? 'audio' : 'image'
      setMessages((prev) => [
        ...prev,
        {
          id: `demo-${Date.now()}`,
          sender_id: DEMO_ME_ID,
          sender_name: 'Você',
          sender_avatar: null,
          message_type: mediaType,
          content: null,
          created_at: now,
          is_pinned: false,
          reply_to_id: null,
          reply_content: null,
          reply_sender_name: null,
          reactions: {},
          attachments: [
            {
              id: `demo-att-${Date.now()}`,
              type: type === 'gif' ? 'gif' : mediaType,
              url: URL.createObjectURL(file),
              mime: file.type,
              size: file.size,
              width: null,
              height: null,
              duration: null,
            },
          ],
        },
      ])
      setTimeout(() => scrollToBottom(), 50)
      return
    }
    setSending(true)
    try {
      await sendMediaMessage(conversationId, file, type)
      scrollToBottom()
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  async function handleReact(messageId: string, reaction: string) {
    if (isDemo) {
      const key = `${messageId}:${reaction}`
      const reacted = demoReactedRef.current.has(key)
      if (reacted) demoReactedRef.current.delete(key)
      else demoReactedRef.current.add(key)
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m
          const count = m.reactions?.[reaction] ?? 0
          const next = { ...(m.reactions ?? {}) }
          if (reacted) {
            if (count <= 1) delete next[reaction]
            else next[reaction] = count - 1
          } else {
            next[reaction] = count + 1
          }
          return { ...m, reactions: next }
        })
      )
      setShowEmojiPicker(null)
      return
    }
    try {
      await toggleReaction(messageId, reaction)
      // Refresh message reactions
      const updated = await getConversationMessages(conversationId!, 100)
      setMessages(updated)
    } catch {
      // silent
    }
    setShowEmojiPicker(null)
  }

  async function handleDelete(messageId: string) {
    if (!isDemo) {
      try {
        await deleteMessage(messageId)
      } catch {
        setContextMenu(null)
        return
      }
    }
    setMessages((prev) => prev.map((m) =>
      m.id === messageId
        ? { ...m, content: null, message_type: 'system' as const, deleted_at: new Date().toISOString() }
        : m
    ))
    setContextMenu(null)
  }

  function handleScrollUp() {
    isAtBottomRef.current = false
  }

  const displayName = otherUser?.full_name ?? t.chatRiderFallback

  return (
    <div className="flex flex-col h-screen bg-amz-areia dark:bg-[#091e24]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#091e24]/95 backdrop-blur-lg border-b border-amz-areia-dark/40 dark:border-white/10 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label={t.adminBack} className="p-1 text-amz-terra dark:text-amz-areia hover:bg-amz-terra/10 dark:hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {otherUser?.avatar_url ? (
          <img src={otherUser.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-amz-dourado/40" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold text-sm">
            {displayName[0]?.toUpperCase() ?? 'R'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amz-terra dark:text-white text-sm truncate">{displayName}</p>
          <p className="text-xs text-amz-terra-light dark:text-white/50">{t.chatOnline || 'Online'}</p>
        </div>
        {isDemo && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amz-dourado/15 text-amz-dourado border border-amz-dourado/30 shrink-0">
            Demo
          </span>
        )}
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScrollUp}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-amz-dourado/10 dark:bg-amz-dourado/15 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-amz-dourado" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-amz-terra-light dark:text-white/50 text-sm">
              {t.chatEmpty || 'Inicie a conversa! Envie a primeira mensagem.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUser?.id}
              currentUserId={currentUser?.id}
              onReply={() => setReplyTo(msg)}
              onReact={(reaction) => handleReact(msg.id, reaction)}
              onDelete={() => handleDelete(msg.id)}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              quickReactions={quickReactions}
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onSendMedia={handleSendMedia}
        sending={sending}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  )
}
