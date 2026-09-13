import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import {
  getTrip, joinTrip, leaveTrip, getTripParticipants, getTripConversation,
  getTripFeed, getTripInvitableFriends, inviteToTrip, removeTripParticipant,
  type TripDetail as TripDetailType, type TripParticipant,
  type TripConversation, type TripFeedPost, type InvitableFriend,
} from '../services/trips'
import { toggleLike, type PostAuthor } from '../services/feed'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function getTimeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

type Tab = 'info' | 'participants' | 'feed'

export default function TripDetailPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<TripDetailType | null>(null)
  const [participants, setParticipants] = useState<(TripParticipant & { full_name: string | null; avatar_url: string | null })[]>([])
  const [conversation, setConversation] = useState<TripConversation | null>(null)
  const [feedPosts, setFeedPosts] = useState<TripFeedPost[]>([])
  const [feedAuthors, setFeedAuthors] = useState<Record<string, PostAuthor>>({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [invitableFriends, setInvitableFriends] = useState<InvitableFriend[]>([])
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [pendingInvites, setPendingInvites] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!id || userId === null) return
    let cancelled = false
    async function load() {
      try {
        const [tripData, participantsData, conversationData] = await Promise.all([
          getTrip(id!),
          getTripParticipants(id!),
          getTripConversation(id!).catch(() => null),
        ])
        if (cancelled) return
        setTrip(tripData)
        setParticipants(participantsData)
        setConversation(conversationData)

        if (tripData?.is_participant) {
          try {
            const posts = await getTripFeed(id!)
            if (!cancelled) {
              setFeedPosts(posts)
              const userIds = [...new Set(posts.map((p) => p.user_id))]
              if (userIds.length > 0) {
                const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds)
                if (profiles && !cancelled) {
                  const authorsMap: Record<string, PostAuthor> = {}
                  profiles.forEach((p) => { authorsMap[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url } })
                  setFeedAuthors(authorsMap)
                }
              }
            }
          } catch { /* feed optional */ }
        }

        const pending = participantsData.filter((p) => p.status === 'pending').map((p) => p.user_id)
        if (!cancelled) setPendingInvites(pending)
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar viagem')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, userId])

  async function handleJoin() {
    if (!id || actionLoading) return
    setActionLoading(true)
    try {
      await joinTrip(id)
      setTrip((prev) => prev ? { ...prev, is_participant: true, participant_count: prev.participant_count + 1 } : prev)
      if (userId) {
        setParticipants((prev) => [...prev, { id: '', trip_id: id!, user_id: userId, role: 'participant', status: 'confirmed', joined_at: new Date().toISOString(), full_name: null, avatar_url: null }])
      }
      const conv = await getTripConversation(id).catch(() => null)
      setConversation(conv)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar na viagem')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleLeave() {
    if (!id || actionLoading) return
    if (!window.confirm(t.tripLeaveConfirm || 'Sair desta viagem?')) return
    setActionLoading(true)
    try {
      await leaveTrip(id)
      setTrip((prev) => prev ? { ...prev, is_participant: false, participant_count: Math.max(0, prev.participant_count - 1) } : prev)
      if (userId) setParticipants((prev) => prev.filter((p) => p.user_id !== userId))
      setConversation(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao sair da viagem')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleInvite(friendId: string) {
    if (!id) return
    try {
      await inviteToTrip(id, friendId)
      setPendingInvites((prev) => [...prev, friendId])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar convite')
    }
  }

  async function handleRemoveParticipant(participantUserId: string) {
    if (!id || actionLoading) return
    if (!window.confirm(t.tripRemoveConfirm || 'Remover este participante?')) return
    setActionLoading(true)
    try {
      await removeTripParticipant(id, participantUserId)
      setParticipants((prev) => prev.filter((p) => p.user_id !== participantUserId))
      setTrip((prev) => prev ? { ...prev, participant_count: Math.max(0, prev.participant_count - 1) } : prev)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao remover participante')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleLikePost(postId: string) {
    try {
      const nowLiked = await toggleLike(postId)
      setFeedPosts((prev) => prev.map((p) =>
        p.id === postId ? { ...p, liked_by_me: nowLiked, likes_count: nowLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1) } : p
      ))
    } catch { /* silent */ }
  }

  async function openInviteModal() {
    if (!id) return
    setShowInviteModal(true)
    setLoadingFriends(true)
    try {
      const friends = await getTripInvitableFriends(id)
      setInvitableFriends(friends)
    } catch { /* silent */ }
    setLoadingFriends(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] flex items-center justify-center pb-20 md:pb-4">
        <div className="w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
        <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">{t.tripDetail || 'Viagem'}</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <p className="text-amz-terra-light dark:text-amz-areia/60 text-sm">{error || t.tripNotFound || 'Viagem não encontrada'}</p>
        </div>
      </div>
    )
  }

  const isOrganizer = trip.created_by === userId
  const isFull = trip.max_participants != null && trip.participant_count >= trip.max_participants

  const statusColors: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    full: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    draft: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }

  const statusLabels: Record<string, string> = {
    published: t.tripStatusPublished || 'Aberta',
    full: t.tripStatusFull || 'Lotada',
    cancelled: t.tripStatusCancelled || 'Cancelada',
    completed: t.tripStatusCompleted || 'Concluída',
    draft: t.tripStatusDraft || 'Rascunho',
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia truncate flex-1">{trip.title}</h1>
        {isOrganizer && (
          <button onClick={() => navigate(`/trips/${id}/edit`)} className="p-2 text-amz-oceano hover:bg-amz-oceano/10 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
        )}
      </header>

      {trip.cover_url && (
        <div className="h-48 overflow-hidden">
          <img src={trip.cover_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[trip.status] || ''}`}>
            {statusLabels[trip.status] || trip.status}
          </span>
          {trip.is_participant && (
            <span className="text-[10px] font-semibold text-amz-oceano bg-amz-oceano/10 px-2 py-0.5 rounded-full">
              {t.tripJoined || 'Participando'}
            </span>
          )}
        </div>

        {trip.destination && (
          <p className="text-sm text-amz-terra dark:text-amz-areia flex items-center gap-1 mb-1">
            <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {trip.destination}
          </p>
        )}

        {(trip.start_date || trip.end_date) && (
          <p className="text-sm text-amz-terra dark:text-amz-areia flex items-center gap-1 mb-3">
            <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {trip.start_date && formatDate(trip.start_date)}
            {trip.start_date && trip.end_date && ' — '}
            {trip.end_date && formatDate(trip.end_date)}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          {userId && trip.status === 'published' && !isOrganizer && (
            trip.is_participant ? (
              <button onClick={handleLeave} disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40">
                {actionLoading ? '...' : (t.tripLeave || 'Sair')}
              </button>
            ) : (
              <button onClick={handleJoin} disabled={actionLoading || isFull}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amz-oceano text-white hover:bg-amz-oceano/90 transition-colors disabled:opacity-40">
                {actionLoading ? '...' : isFull ? (t.tripFull || 'Lotada') : (t.tripJoin || 'Participar')}
              </button>
            )
          )}
          {isOrganizer && (
            <button onClick={openInviteModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amz-dourado text-white hover:bg-amz-dourado/90 transition-colors">
              {t.tripInvite || 'Convidar'}
            </button>
          )}
          {conversation && conversation.is_member && (
            <button onClick={() => navigate(`/chat/${conversation.conversation_id}`)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {t.tripChat || 'Chat'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-1 mb-4">
          {(['info', 'participants', 'feed'] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab ? 'bg-amz-oceano text-white' : 'text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}>
              {tab === 'info' ? (t.tripTabInfo || 'Info') : tab === 'participants' ? (t.tripTabParticipants || 'Pessoas') : (t.tripTabFeed || 'Feed')}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="space-y-4">
            {trip.description && (
              <div className="bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-4">
                <p className="text-sm text-amz-terra dark:text-amz-areia whitespace-pre-wrap leading-relaxed">{trip.description}</p>
              </div>
            )}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-4">
              <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia mb-1">{t.tripOrganizedBy || 'Organizado por'}</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amz-oceano/10 flex items-center justify-center">
                  {trip.creator_avatar ? (
                    <img src={trip.creator_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-amz-oceano">{getInitials(trip.creator_name)}</span>
                  )}
                </div>
                <span className="text-sm text-amz-terra dark:text-amz-areia">{trip.creator_name || 'Rider'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-2">
            {participants.length === 0 ? (
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 text-center py-4">{t.tripNoParticipants || 'Nenhum participante ainda'}</p>
            ) : (
              participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-3">
                  <div className="w-9 h-9 rounded-full bg-amz-oceano/10 flex items-center justify-center shrink-0">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-amz-oceano">{getInitials(p.full_name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">{p.full_name || 'Rider'}</p>
                    <p className="text-[10px] text-amz-terra-light dark:text-amz-areia/40">
                      {p.role === 'organizer' ? (t.tripRoleOrganizer || 'Organizador') : (t.tripRoleParticipant || 'Participante')}
                      {p.status === 'pending' && ` · ${t.tripPending || 'Pendente'}`}
                    </p>
                  </div>
                  {isOrganizer && p.user_id !== userId && p.role !== 'organizer' && (
                    <button onClick={() => handleRemoveParticipant(p.user_id)} disabled={actionLoading}
                      className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-3">
            {!trip.is_participant ? (
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 text-center py-4">{t.tripFeedJoinFirst || 'Participe da trip para ver o feed'}</p>
            ) : feedPosts.length === 0 ? (
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 text-center py-4">{t.tripFeedEmpty || 'Nenhum post ainda'}</p>
            ) : (
              feedPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-amz-oceano/10 flex items-center justify-center">
                      {feedAuthors[post.user_id]?.avatar_url ? (
                        <img src={feedAuthors[post.user_id].avatar_url!} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold text-amz-oceano">{getInitials(feedAuthors[post.user_id]?.full_name)}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{feedAuthors[post.user_id]?.full_name || 'Rider'}</span>
                    <span className="text-[10px] text-amz-terra-light dark:text-amz-areia/40">{getTimeAgo(post.created_at)}</span>
                  </div>
                  {post.content && <p className="text-sm text-amz-terra dark:text-amz-areia whitespace-pre-wrap mb-2">{post.content}</p>}
                  {post.media_url && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img src={post.media_url} alt="" className="w-full max-h-60 object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 border-t border-amz-areia-dark/10 dark:border-white/5">
                    <button onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${post.liked_by_me ? 'text-red-500' : 'text-amz-terra-light dark:text-amz-areia/40 hover:text-red-400'}`}>
                      <svg className="w-3.5 h-3.5" fill={post.liked_by_me ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes_count > 0 && post.likes_count}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{t.tripInviteFriends || 'Convidar Amigos'}</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-96 p-4 space-y-2">
              {loadingFriends ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-amz-oceano border-t-transparent rounded-full animate-spin" />
                </div>
              ) : invitableFriends.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">{t.tripNoFriendsToInvite || 'Nenhum amigo disponível'}</p>
              ) : (
                invitableFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                    <div className="w-9 h-9 rounded-full bg-amz-oceano/10 flex items-center justify-center shrink-0">
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-amz-oceano">{getInitials(friend.full_name)}</span>
                      )}
                    </div>
                    <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">{friend.full_name || 'Rider'}</span>
                    {pendingInvites.includes(friend.id) ? (
                      <span className="text-[10px] text-amz-oceano font-semibold">{t.tripInvited || 'Convidado'}</span>
                    ) : (
                      <button onClick={() => handleInvite(friend.id)}
                        className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-amz-oceano text-white hover:bg-amz-oceano/90 transition-colors">
                        {t.tripInviteButton || 'Convidar'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
