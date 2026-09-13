import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { listTrips, type TripListItem } from '../services/trips'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function TripsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<TripListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await listTrips()
        if (!cancelled) setTrips(data)
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar viagens')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

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
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">
          {t.tripsTitle || 'Trips'}
        </h1>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden animate-pulse">
                <div className="h-40 bg-amz-areia dark:bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-amz-areia dark:bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-amz-areia dark:bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
            <div className="text-4xl mb-3">🏍️</div>
            <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">{t.tripsEmpty || 'Nenhuma trip disponível'}</p>
            <p className="text-xs text-amz-terra-light dark:text-amz-areia/30">{t.tripsEmptyHint || 'Embreve novas trips serão anunciadas!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="w-full bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden text-left hover:shadow-lg transition-shadow"
              >
                {trip.cover_url && (
                  <div className="h-40 overflow-hidden">
                    <img src={trip.cover_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-amz-terra dark:text-amz-areia text-base leading-tight">{trip.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${statusColors[trip.status] || ''}`}>
                      {statusLabels[trip.status] || trip.status}
                    </span>
                  </div>
                  {trip.destination && (
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 flex items-center gap-1 mb-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {trip.destination}
                    </p>
                  )}
                  {(trip.start_date || trip.end_date) && (
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 flex items-center gap-1 mb-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {trip.start_date && formatDate(trip.start_date)}
                      {trip.start_date && trip.end_date && ' — '}
                      {trip.end_date && formatDate(trip.end_date)}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {trip.participant_count}{trip.max_participants ? `/${trip.max_participants}` : ''} {t.tripParticipants || 'participantes'}
                    </p>
                    {trip.is_participant && (
                      <span className="text-[10px] font-semibold text-amz-oceano bg-amz-oceano/10 px-2 py-0.5 rounded-full">
                        {t.tripJoined || 'Participando'}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
