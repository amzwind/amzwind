import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { getUserConversations, type ConversationPreview } from '../services/chat'
import { supabase } from '../services/supabase'
import { MOCK_CONVERSATIONS } from '../data/community'
import NotificationBadge from '../components/NotificationBadge'

const fallbackName = 'Rider'

export default function ConversationsList() {
  const { t } = useLanguage()
  const fallback = t.convRiderFallback || fallbackName
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    id: string
    full_name: string | null
    avatar_url: string | null
  }>>([])
  const [searching, setSearching] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getUserConversations()
        if (cancelled) return
        if (data.length === 0) {
          // Fallback de demonstração: conversas ativas da comunidade
          setConversations(
            MOCK_CONVERSATIONS.map((m) => ({
              conversation_id: m.conversation_id,
              type: 'direct' as const,
              name: m.name,
              avatar_url: m.avatar_url,
              last_message: m.last_message,
              last_message_at: m.last_message_at,
              last_message_sender: m.rider_id,
              unread_count: m.unread_count,
              member_count: m.member_count,
            }))
          )
          setIsDemo(true)
        } else {
          setConversations(data)
        }
      } catch {
        if (!cancelled) {
          setConversations(
            MOCK_CONVERSATIONS.map((m) => ({
              conversation_id: m.conversation_id,
              type: 'direct' as const,
              name: m.name,
              avatar_url: m.avatar_url,
              last_message: m.last_message,
              last_message_at: m.last_message_at,
              last_message_sender: m.rider_id,
              unread_count: m.unread_count,
              member_count: m.member_count,
            }))
          )
          setIsDemo(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timeout = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase.rpc('search_users', { p_query: searchQuery.trim() })
      setSearchResults(data ?? [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  async function openChat(userId: string) {
    const { getOrCreateDirectConversation } = await import('../services/chat')
    const convId = await getOrCreateDirectConversation(userId)
    navigate(`/chat/${convId}`)
    setSearchQuery('')
    setSearchResults([])
  }

  function formatTime(iso: string | null): string {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return t.convYesterday || 'Ontem'
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
    return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#091e24] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#091e24]/95 backdrop-blur-lg border-b border-amz-areia-dark/40 dark:border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amz-dourado to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amz-dourado/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-amz-terra dark:text-white flex-1">
            {t.convTitle || 'Conversas'}
          </h1>
          {isDemo && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amz-dourado/15 text-amz-dourado border border-amz-dourado/30">
              Demo
            </span>
          )}
          <NotificationBadge />
        </div>
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.convSearchPlaceholder || 'Buscar riders...'}
            className="w-full bg-white dark:bg-white/10 rounded-full border border-amz-areia-dark/40 dark:border-white/10 px-4 py-2.5 text-sm text-amz-terra dark:text-white placeholder-amz-terra-light/60 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amz-dourado/50"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#162f37] rounded-2xl shadow-xl border border-amz-areia-dark/40 dark:border-white/10 max-h-64 overflow-y-auto z-50">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => openChat(user.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amz-areia dark:hover:bg-white/10 transition-colors"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold text-sm">
                      {(user.full_name?.[0] ?? fallback[0]).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-amz-terra dark:text-white">
                    {user.full_name ?? fallback}
                  </span>
                </button>
              ))}
            </div>
          )}
          {searching && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#162f37] rounded-2xl shadow-xl border border-amz-areia-dark/40 dark:border-white/10 p-4 text-center text-sm text-amz-terra-light dark:text-white/50">
              {t.convSearching || 'Buscando...'}
            </div>
          )}
        </div>
      </header>

      <main className="divide-y divide-amz-areia-dark/40 dark:divide-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amz-dourado/10 dark:bg-amz-dourado/15 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amz-dourado" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-amz-terra-light dark:text-white/50 text-sm">
              {t.convEmpty || 'Nenhuma conversa ainda. Busque um rider acima para iniciar!'}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.conversation_id}
              onClick={() => navigate(`/chat/${conv.conversation_id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amz-terra/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              {conv.avatar_url ? (
                <img src={conv.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold flex-shrink-0">
                  {(conv.name?.[0] ?? fallback[0]).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-amz-terra dark:text-white truncate">
                    {conv.name ?? fallback}
                  </span>
                  <span className="text-xs text-amz-terra-light dark:text-white/40 flex-shrink-0">
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-amz-terra-light dark:text-white/50 truncate">
                    {conv.last_message ?? (t.convStartChat || 'Iniciar conversa...')}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="flex-shrink-0 bg-amz-dourado text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {conv.unread_count > 99 ? '99+' : conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </main>
    </div>
  )
}
