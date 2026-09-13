import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'
import {
  searchUsers,
  sendFriendRequest,
  respondFriendRequest,
  removeFriend,
  getOrCreateDirectConversation,
  type UserProfile,
} from '../services/chat'

type FriendRequestRow = Tables<'friend_requests'>

export default function FriendsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'friends' | 'requests' | 'find'>('friends')
  const [friends, setFriends] = useState<Array<{
    id: string
    full_name: string | null
    avatar_url: string | null
  }>>([])
  const [requests, setRequests] = useState<Array<FriendRequestRow & {
    sender_profile?: { full_name: string | null; avatar_url: string | null }
    receiver_profile?: { full_name: string | null; avatar_url: string | null }
  }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) { setLoading(false); return }
      setCurrentUserId(user.id)

      // Load friends
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

      if (!cancelled && friendships) {
        const friendIds = friendships.map((f) =>
          f.user_id === user.id ? f.friend_id : f.user_id
        )
        if (friendIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', friendIds)
          if (!cancelled && profiles) setFriends(profiles)
        }
      }

      // Load pending requests
      const { data: reqs } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (!cancelled && reqs) {
        const allIds = [...new Set(reqs.flatMap((r) => [r.sender_id, r.receiver_id]))]
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', allIds)

        const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
        const enriched = reqs.map((r) => ({
          ...r,
          sender_profile: profileMap[r.sender_id],
          receiver_profile: profileMap[r.receiver_id],
        }))
        if (!cancelled) setRequests(enriched)
      }

      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timeout = setTimeout(async () => {
      const results = await searchUsers(searchQuery.trim())
      setSearchResults(results)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  async function handleSendRequest(userId: string) {
    setActionLoading(userId)
    try {
      await sendFriendRequest(userId)
      setSearchResults((prev) =>
        prev.map((u) => u.id === userId ? { ...u, request_status: 'pending' } : u)
      )
    } catch { /* silent */ }
    setActionLoading(null)
  }

  async function handleRespond(requestId: string, accept: boolean) {
    setActionLoading(requestId)
    try {
      await respondFriendRequest(requestId, accept)
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
      if (accept) {
        // Reload friends
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: friendships } = await supabase
            .from('friendships')
            .select('*')
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          if (friendships) {
            const friendIds = friendships.map((f) =>
              f.user_id === user.id ? f.friend_id : f.user_id
            )
            if (friendIds.length > 0) {
              const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', friendIds)
              if (profiles) setFriends(profiles)
            }
          }
        }
      }
    } catch { /* silent */ }
    setActionLoading(null)
  }

  async function handleRemoveFriend(userId: string) {
    setActionLoading(userId)
    try {
      await removeFriend(userId)
      setFriends((prev) => prev.filter((f) => f.id !== userId))
    } catch { /* silent */ }
    setActionLoading(null)
  }

  async function handleMessage(userId: string) {
    const convId = await getOrCreateDirectConversation(userId)
    navigate(`/chat/${convId}`)
  }

  const tabs = [
    { key: 'friends' as const, label: t.friendsList || 'Amigos', count: friends.length },
    { key: 'requests' as const, label: t.friendsRequests || 'Pedidos', count: requests.length },
    { key: 'find' as const, label: t.friendsFind || 'Encontrar' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {t.friendsTitle || 'Amigos'}
        </h1>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
                tab === tabItem.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tabItem.label}
              {tabItem.count !== undefined && tabItem.count > 0 && (
                <span className="ml-1 bg-emerald-500 text-white text-[10px] rounded-full px-1.5">
                  {tabItem.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'friends' ? (
          friends.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t.friendsEmpty || 'Nenhum amigo ainda. Vá para "Encontrar" para adicionar riders!'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 py-3">
                  {friend.avatar_url ? (
                    <img src={friend.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                      {(friend.full_name?.[0] ?? 'R').toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                      {friend.full_name ?? 'Rider'}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleMessage(friend.id)}
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                      title={t.chatSendMessage || 'Enviar mensagem'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      disabled={actionLoading === friend.id}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                      title={t.friendsRemove || 'Remover'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === 'requests' ? (
          requests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t.friendsNoRequests || 'Nenhum pedido pendente.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => {
                const isSender = req.sender_id !== currentUserId
                const other = isSender ? req.sender_profile : req.receiver_profile
                return (
                  <div key={req.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    {other?.avatar_url ? (
                      <img src={other.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {(other?.full_name?.[0] ?? 'R').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {other?.full_name ?? 'Rider'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isSender ? (t.friendsRequestSent || 'Pedido enviado') : (t.friendsRequestReceived || 'Pedido recebido')}
                      </p>
                    </div>
                    {!isSender && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleRespond(req.id, true)}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {t.friendsAccept || 'Aceitar'}
                        </button>
                        <button
                          onClick={() => handleRespond(req.id, false)}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          {t.friendsReject || 'Rejeitar'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.friendsSearchPlaceholder || 'Buscar riders por nome...'}
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            {searchResults.length > 0 && (
              <div className="space-y-1">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 py-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {(user.full_name?.[0] ?? 'R').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {user.full_name ?? 'Rider'}
                      </p>
                    </div>
                    {user.is_friend ? (
                      <button
                        onClick={() => handleMessage(user.id)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full"
                      >
                        {t.friendsAlreadyFriend || 'Amigo'}
                      </button>
                    ) : user.request_status === 'pending' ? (
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
                        {t.friendsPending || 'Pendente'}
                      </span>
                    ) : user.request_status === 'self' ? null : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === user.id ? '...' : (t.friendsAdd || 'Adicionar')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t.friendsNoResults || 'Nenhum rider encontrado.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
