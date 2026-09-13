import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import { Toast } from './SharedUI'
import { listTrips, type TripListItem } from '../../services/trips'

type TripStatus = 'draft' | 'published' | 'full' | 'cancelled' | 'completed'

export function TripsManager() {
  const [trips, setTrips] = useState<TripListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [filter, setFilter] = useState<'all' | TripStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadTrips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listTrips()
      setTrips(data)
    } catch (err) {
      console.error('Erro ao carregar trips:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTrips() }, [loadTrips])

  async function handleUpdateStatus(id: string, status: TripStatus) {
    setUpdatingId(id)
    try {
      const { error } = await supabase.from('trips').update({ status }).eq('id', id)
      if (error) throw error
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
      setToast({ message: 'Status atualizado!', type: 'success' })
    } catch (err: any) {
      setToast({ message: 'Erro: ' + err.message, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDeleteTrip(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta trip?')) return
    setUpdatingId(id)
    try {
      const { error } = await supabase.from('trips').delete().eq('id', id)
      if (error) throw error
      setTrips((prev) => prev.filter((t) => t.id !== id))
      setToast({ message: 'Trip excluída!', type: 'success' })
    } catch (err: any) {
      setToast({ message: 'Erro: ' + err.message, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/40',
    published: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    full: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    completed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  }

  const statusLabels: Record<string, string> = {
    draft: 'Rascunho',
    published: 'Publicada',
    full: 'Lotada',
    cancelled: 'Cancelada',
    completed: 'Concluída',
  }

  const filteredTrips = filter === 'all' ? trips : trips.filter((t) => t.status === filter)

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h3 className="font-maybug text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Trips ({trips.length})
        </h3>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'draft', 'published', 'full', 'cancelled', 'completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === s
                ? 'bg-amz-dourado text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {s === 'all' ? 'Todas' : statusLabels[s]} ({s === 'all' ? trips.length : trips.filter((t) => t.status === s).length})
          </button>
        ))}
      </div>

      {/* Trips Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/[0.06] animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-gray-200 dark:border-white/[0.06]">
          <div className="text-4xl mb-3">🏔️</div>
          <p className="text-gray-500 dark:text-white/40">Nenhuma trip encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Cover thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0">
                    {trip.cover_url ? (
                      <img src={trip.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-white/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{trip.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusColors[trip.status] || statusColors.draft}`}>
                        {statusLabels[trip.status] || trip.status}
                      </span>
                    </div>
                    {trip.destination && (
                      <p className="text-xs text-gray-500 dark:text-white/40 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {trip.destination}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-1">
                      {trip.start_date && (
                        <span className="text-[11px] text-gray-400 dark:text-white/30">
                          {new Date(trip.start_date).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 dark:text-white/30">
                        {trip.participant_count || 0}/{trip.max_participants || '?'} participantes
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status dropdown */}
                    <select
                      value={trip.status}
                      onChange={(e) => handleUpdateStatus(trip.id, e.target.value as TripStatus)}
                      disabled={updatingId === trip.id}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white/60 focus:outline-none focus:ring-1 focus:ring-amz-dourado/50 disabled:opacity-50"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicada</option>
                      <option value="full">Lotada</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="completed">Concluída</option>
                    </select>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      disabled={updatingId === trip.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      title="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
