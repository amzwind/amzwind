import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import { getTrip, joinTrip, leaveTrip, getTripParticipants, type TripDetail as TripDetailType, type TripParticipant } from '../services/trips'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function TripDetailPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<TripDetailType | null>(null)
  const [participants, setParticipants] = useState<(TripParticipant & { full_name: string | null; avatar_url: string | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const [tripData, participantsData] = await Promise.all([
          getTrip(id!),
          getTripParticipants(id!),
        ])
        if (!cancelled) {
          setTrip(tripData)
          setParticipants(participantsData)
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar viagem')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  async function handleJoin() {
    if (!id || actionLoading) return
    setActionLoading(true)
    try {
      await joinTrip(id)
      setTrip((prev) => prev ? { ...prev, is_participant: true, participant_count: prev.participant_count + 1 } : prev)
      if (userId) {
        setParticipants((prev) => [...prev, { id: '', trip_id: id!, user_id: userId, role: 'participant', status: 'confirmed', joined_at: new Date().toISOString(), full_name: null, avatar_url: null }])
      }
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
      if (userId) {
        setParticipants((prev) => prev.filter((p) => p.user_id !== userId))
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao sair da viagem')
    } finally {
      setActionLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia truncate">{trip.title}</h1>
      </header>

      <main className="max-w-2xl mx-auto">
        {trip.cover_url && (
          <div className="h-56 overflow-hidden">
            <img src={trip.cover_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2 text-sm text-amz-terra dark:text-amz-areia">
              <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {trip.destination}
            </div>
          )}

          {(trip.start_date || trip.end_date) && (
            <div className="flex items-center gap-2 text-sm text-amz-terra dark:text-amz-areia">
              <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {trip.start_date && formatDate(trip.start_date)}
              {trip.start_date && trip.end_date && ' — '}
              {trip.end_date && formatDate(trip.end_date)}
            </div>
          )}

          {trip.description && (
            <p className="text-sm text-amz-terra dark:text-amz-areia whitespace-pre-wrap leading-relaxed">
              {trip.description}
            </p>
          )}

          <div className="bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-amz-terra dark:text-amz-areia">
                {t.tripParticipants || 'Participantes'}
              </h3>
              <span className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                {trip.participant_count}{trip.max_participants ? `/${trip.max_participants}` : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 rounded-full pl-1 pr-2.5 py-1">
                  <div className="w-6 h-6 rounded-full bg-amz-oceano/10 flex items-center justify-center">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-[8px] font-bold text-amz-oceano">{getInitials(p.full_name)}</span>
                    )}
                  </div>
                  <span className="text-xs text-amz-terra dark:text-amz-areia">{p.full_name || 'Rider'}</span>
                  {p.role === 'organizer' && (
                    <span className="text-[9px] text-amz-dourado font-semibold">★</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {trip.created_by && (
            <div className="flex items-center gap-2 text-xs text-amz-terra-light dark:text-amz-areia/40">
              <span>{t.tripOrganizedBy || 'Organizado por'}</span>
              <span className="font-medium text-amz-terra dark:text-amz-areia">{trip.creator_name || 'Rider'}</span>
            </div>
          )}

          {userId && trip.status === 'published' && !isOrganizer && (
            <div className="pt-2">
              {trip.is_participant ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {actionLoading ? '...' : (t.tripLeave || 'Sair da Trip')}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading || isFull}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-amz-oceano text-white hover:bg-amz-oceano/90 transition-colors disabled:opacity-40"
                >
                  {actionLoading ? '...' : isFull ? (t.tripFull || 'Lotada') : (t.tripJoin || 'Participar')}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
