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

type Profile = Tables<'profiles'>

const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '🔥']

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

  const scrollToBottom = useCallback((smooth = true) => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    }
  }, [])

  useEffect(() => {
    if (!conversationId) return
    let cancelled = false

    async function init() {
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
  }, [conversationId, scrollToBottom])

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return

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
  }, [conversationId, scrollToBottom])

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
    try {
      await deleteMessage(messageId)
      setMessages((prev) => prev.map((m) =>
        m.id === messageId
          ? { ...m, content: null, message_type: 'system' as const, deleted_at: new Date().toISOString() }
          : m
      ))
    } catch {
      // silent
    }
    setContextMenu(null)
  }

  function handleScrollUp() {
    isAtBottomRef.current = false
  }

  const displayName = otherUser?.full_name ?? t.chatRiderFallback

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label={t.adminBack} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {otherUser?.avatar_url ? (
          <img src={otherUser.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            {displayName[0]?.toUpperCase() ?? 'R'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{displayName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.chatOnline || 'Online'}</p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScrollUp}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
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
