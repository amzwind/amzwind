import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { filterPeopleByQuery, sortPeopleByName } from '../lib/friendFilters'
import { MOCK_RIDERS, MOCK_FRIEND_REQUESTS, type MockRider } from '../data/community'

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
  const [friendSearch, setFriendSearch] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  // Demonstração local (comunidade mock): sugestões, pedidos e amizades simuladas
  const [mockRequests, setMockRequests] = useState(MOCK_FRIEND_REQUESTS)
  const [mockPendingIds, setMockPendingIds] = useState<string[]>([])
  const [mockFriends, setMockFriends] = useState<MockRider[]>([])

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
    } catch (err) {
      console.error('Falha ao enviar pedido de amizade:', err)
    }
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
    } catch (err) {
      console.error('Falha ao responder pedido de amizade:', err)
    }
    setActionLoading(null)
  }

  async function handleRemoveFriend(userId: string) {
    setActionLoading(userId)
    try {
      await removeFriend(userId)
      setFriends((prev) => prev.filter((f) => f.id !== userId))
    } catch (err) {
      console.error('Falha ao remover amigo:', err)
    }
    setActionLoading(null)
  }

  async function handleMessage(userId: string) {
    const convId = await getOrCreateDirectConversation(userId)
    navigate(`/chat/${convId}`)
  }

  // ---- Interações locais com riders de demonstração (sem banco) ----
  function handleMockAdd(riderId: string) {
    setActionLoading(riderId)
    setTimeout(() => {
      setMockPendingIds((prev) => (prev.includes(riderId) ? prev : [...prev, riderId]))
      setActionLoading(null)
    }, 400)
  }

  function handleMockRespond(requestId: string, accept: boolean) {
    const req = mockRequests.find((r) => r.id === requestId)
    setMockRequests((prev) => prev.filter((r) => r.id !== requestId))
    if (accept && req && !mockFriends.some((f) => f.id === req.sender.id)) {
      setMockFriends((prev) => [...prev, req.sender])
    }
  }

  function handleMockRemove(riderId: string) {
    setMockFriends((prev) => prev.filter((f) => f.id !== riderId))
  }

  const pendingCount = requests.length + mockRequests.length

  const tabs = [
    { key: 'friends' as const, label: t.friendsList || 'Amigos', count: friends.length + mockFriends.length },
    { key: 'requests' as const, label: t.friendsRequests || 'Pedidos', count: pendingCount },
    { key: 'find' as const, label: t.friendsFind || 'Encontrar' },
  ]

  const allFriends = [
    ...friends,
    ...mockFriends.map((m) => ({ id: m.id, full_name: m.full_name, avatar_url: m.avatar_url })),
  ]
  const filteredFriends = filterPeopleByQuery(allFriends, friendSearch)
  const orderedSearchResults = sortPeopleByName(searchResults)

  const knownIds = new Set([
    ...friends.map((f) => f.id),
    ...mockFriends.map((f) => f.id),
    ...mockPendingIds,
    ...(currentUserId ? [currentUserId] : []),
  ])

  const suggestions = [...MOCK_RIDERS]
    .filter((r) => !knownIds.has(r.id))
    .sort((a, b) => b.mutual_friends - a.mutual_friends)
    .slice(0, 5)

  const mockSearchMatches = searchQuery.trim()
    ? MOCK_RIDERS.filter(
        (r) =>
          !knownIds.has(r.id) &&
          (r.full_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            r.location.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      ).slice(0, 5)
    : []

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
          <>
            <div className="mb-4">
              <input
                aria-label="Buscar amigos"
                placeholder={t.friendsSearchPlaceholder || 'Buscar amigos por nome...'}
                value={friendSearch}
                onChange={(event) => setFriendSearch(event.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {friendSearch
                    ? 'Nenhum amigo encontrado para esta busca.'
                    : t.friendsEmpty || 'Nenhum amigo ainda. Vá para "Encontrar" para adicionar riders!'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredFriends.map((friend) => {
                  const isMock = friend.id.startsWith('mock-')
                  return (
                  <div key={friend.id} className="flex items-center gap-3 py-3">
                    {friend.avatar_url ? (
                      <img src={friend.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {(friend.full_name?.[0] ?? 'R').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {isMock ? (
                        <Link to={`/rider/${friend.id}`} className="font-medium text-gray-900 dark:text-white truncate text-sm hover:text-amz-dourado transition-colors block">
                          {friend.full_name ?? (t.friendsRiderFallback || 'Rider')}
                        </Link>
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {friend.full_name ?? (t.friendsRiderFallback || 'Rider')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {!isMock && (
                      <button
                      onClick={() => handleMessage(friend.id)}
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                      title={t.chatSendMessage || 'Enviar mensagem'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                      )}
                    <button
                      onClick={() => (isMock ? handleMockRemove(friend.id) : handleRemoveFriend(friend.id))}
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
                  )
                })}
              </div>
            )}
          </>
        ) : tab === 'requests' ? (
          requests.length === 0 && mockRequests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t.friendsNoRequests || 'Nenhum pedido pendente.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {mockRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 bg-amz-dourado/5 dark:bg-amz-dourado/10 rounded-xl border border-amz-dourado/20">
                  {req.sender.avatar_url ? (
                    <img src={req.sender.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold">
                      {(req.sender.full_name?.[0] ?? 'R').toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/rider/${req.sender.id}`} className="font-medium text-gray-900 dark:text-white text-sm hover:text-amz-dourado transition-colors block truncate">
                      {req.sender.full_name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.friendsRequestReceived || 'Pedido recebido'} · {req.sender.mutual_friends} amigos em comum
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleMockRespond(req.id, true)}
                      className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors"
                    >
                      {t.friendsAccept || 'Aceitar'}
                    </button>
                    <button
                      onClick={() => handleMockRespond(req.id, false)}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t.friendsReject || 'Rejeitar'}
                    </button>
                  </div>
                </div>
              ))}
              {requests.map((req) => {
                const isSender = req.sender_id === currentUserId
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
                        {other?.full_name ?? (t.friendsRiderFallback || 'Rider')}
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
            {!searchQuery.trim() && suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Sugestões para você
                </h3>
                <div className="space-y-1">
                  {suggestions.map((rider) => {
                    const pending = mockPendingIds.includes(rider.id)
                    return (
                      <div key={rider.id} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        {rider.avatar_url ? (
                          <img src={rider.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold">
                            {(rider.full_name?.[0] ?? 'R').toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link to={`/rider/${rider.id}`} className="font-medium text-gray-900 dark:text-white text-sm hover:text-amz-dourado transition-colors block truncate">
                            {rider.full_name}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {rider.mutual_friends} amigos em comum · {rider.home_spot}
                          </p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {rider.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-amz-oceano/10 text-amz-oceano dark:text-amz-areia">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {pending ? (
                          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full shrink-0">
                            {t.friendsPending || 'Pendente'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMockAdd(rider.id)}
                            disabled={actionLoading === rider.id}
                            className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 shrink-0"
                          >
                            {actionLoading === rider.id ? '...' : (t.friendsAdd || 'Adicionar')}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {mockSearchMatches.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Riders da comunidade
                </h3>
                <div className="space-y-1">
                  {mockSearchMatches.map((rider) => {
                    const pending = mockPendingIds.includes(rider.id)
                    return (
                      <div key={rider.id} className="flex items-center gap-3 py-3">
                        {rider.avatar_url ? (
                          <img src={rider.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-amz-dourado/15 flex items-center justify-center text-amz-dourado font-bold">
                            {(rider.full_name?.[0] ?? 'R').toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link to={`/rider/${rider.id}`} className="font-medium text-gray-900 dark:text-white text-sm hover:text-amz-dourado transition-colors block truncate">
                            {rider.full_name}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{rider.location}</p>
                        </div>
                        {pending ? (
                          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full shrink-0">
                            {t.friendsPending || 'Pendente'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMockAdd(rider.id)}
                            disabled={actionLoading === rider.id}
                            className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 shrink-0"
                          >
                            {actionLoading === rider.id ? '...' : (t.friendsAdd || 'Adicionar')}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {orderedSearchResults.length > 0 && (
              <div className="space-y-1">
                {orderedSearchResults.map((user) => (
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
                        {user.full_name ?? (t.friendsRiderFallback || 'Rider')}
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
            {searchQuery.trim() && orderedSearchResults.length === 0 && mockSearchMatches.length === 0 && (
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
