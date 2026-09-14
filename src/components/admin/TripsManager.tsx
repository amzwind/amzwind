import { useState, useEffect, useCallback } from 'react'
import { Toast, ModalShell, FormField, Input, PrimaryButton, GhostButton } from './SharedUI'
import { adminListTrips, adminDeleteTrip, adminUpdateTripStatus, updateTrip, type TripListItem } from '../../services/trips'
import { staticTrips, type StaticTrip } from '../../data/trips'

type TripStatus = 'draft' | 'published' | 'full' | 'cancelled' | 'completed'

/** Fallback robusto: espelha as trips estáticas do frontend quando o banco vem vazio. */
function staticTripToListItem(t: StaticTrip): TripListItem {
  return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    description: t.description,
    body_text: t.body_text,
    destination: t.destination,
    start_date: t.start_date,
    end_date: t.end_date,
    cover_url: t.cover_url,
    gallery_urls: t.gallery_urls,
    video_url: t.video_url,
    schedule: t.schedule,
    status: t.status,
    visibility: t.visibility,
    max_participants: t.max_participants,
    created_by: t.created_by,
    created_at: t.created_at,
    updated_at: t.updated_at,
    participant_count: t.participant_count,
    is_participant: false,
    start_point: t.start_point ?? null,
    end_point: t.end_point ?? null,
    start_coords: t.start_coords ?? null,
    end_coords: t.end_coords ?? null,
    route_points: t.route_points ?? [],
    distance_km: t.distance_km ?? 0,
    estimated_duration: t.estimated_duration ?? '',
    wind_condition: t.wind_condition,
  }
}

export function TripsManager() {
  const [trips, setTrips] = useState<TripListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [filter, setFilter] = useState<'all' | TripStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [editingTrip, setEditingTrip] = useState<TripListItem | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    cover_url: '',
    visibility: 'public' as 'public' | 'private',
  })
  const [saving, setSaving] = useState(false)

  const loadTrips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminListTrips()
      if (data.length === 0) {
        // Banco vazio: usa os dados do frontend para o admin nunca ver tela vazia
        setTrips(staticTrips.map(staticTripToListItem))
        setIsFallback(true)
      } else {
        setTrips(data)
        setIsFallback(false)
      }
    } catch {
      setTrips(staticTrips.map(staticTripToListItem))
      setIsFallback(true)
      setToast({ message: 'Banco indisponível — exibindo trips de demonstração.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTrips() }, [loadTrips])

  async function handleUpdateStatus(id: string, status: TripStatus) {
    setUpdatingId(id)
    try {
      if (!isFallback) {
        await adminUpdateTripStatus(id, status)
      }
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
      setToast({ message: isFallback ? 'Status atualizado (demonstração).' : 'Status atualizado!', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDeleteTrip(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta trip?')) return
    setUpdatingId(id)
    try {
      if (!isFallback) {
        await adminDeleteTrip(id)
      }
      setTrips((prev) => prev.filter((t) => t.id !== id))
      setToast({ message: isFallback ? 'Trip removida (demonstração).' : 'Trip excluída!', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  function openEdit(trip: TripListItem) {
    setEditingTrip(trip)
    setEditForm({
      title: trip.title || '',
      destination: trip.destination || '',
      start_date: trip.start_date ? trip.start_date.slice(0, 10) : '',
      end_date: trip.end_date ? trip.end_date.slice(0, 10) : '',
      max_participants: trip.max_participants != null ? String(trip.max_participants) : '',
      cover_url: trip.cover_url || '',
      visibility: trip.visibility || 'public',
    })
  }

  async function handleSaveEdit() {
    if (!editingTrip) return
    if (!editForm.title.trim()) {
      setToast({ message: 'Título é obrigatório.', type: 'error' })
      return
    }
    setSaving(true)
    try {
      if (!isFallback) {
        await updateTrip(editingTrip.id, {
          title: editForm.title.trim(),
          destination: editForm.destination.trim() || undefined,
          start_date: editForm.start_date || undefined,
          end_date: editForm.end_date || undefined,
          max_participants: editForm.max_participants ? Number(editForm.max_participants) : undefined,
          cover_url: editForm.cover_url.trim() || undefined,
          visibility: editForm.visibility,
        })
      }
      setTrips((prev) =>
        prev.map((t) =>
          t.id === editingTrip.id
            ? {
                ...t,
                title: editForm.title.trim(),
                destination: editForm.destination.trim() || null,
                start_date: editForm.start_date || null,
                end_date: editForm.end_date || null,
                max_participants: editForm.max_participants ? Number(editForm.max_participants) : null,
                cover_url: editForm.cover_url.trim() || null,
                visibility: editForm.visibility,
              }
            : t
        )
      )
      setToast({ message: isFallback ? 'Trip atualizada (demonstração).' : 'Trip atualizada!', type: 'success' })
      setEditingTrip(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/40',
    published: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    full: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  }

  const statusLabels: Record<string, string> = {
    draft: 'Rascunho',
    published: 'Publicada',
    full: 'Lotada',
    cancelled: 'Cancelada',
    completed: 'Concluída',
  }

  const visibilityColors: Record<string, string> = {
    public: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    private: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  }

  const visibilityLabels: Record<string, string> = {
    public: 'Pública',
    private: 'Privada',
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

      {isFallback && (
        <div className="flex items-center gap-2 rounded-2xl border border-amz-dourado/30 bg-amz-dourado/5 px-4 py-3 text-xs text-amz-terra dark:text-amz-areia/70">
          <span className="text-base">🧭</span>
          <p>
            <span className="font-bold">Modo demonstração:</span> o banco não retornou trips — exibindo o catálogo do app. Alterações aqui são locais.
          </p>
        </div>
      )}

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
                      {trip.visibility && (
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${visibilityColors[trip.visibility] || ''}`}>
                          {visibilityLabels[trip.visibility] || trip.visibility}
                        </span>
                      )}
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
                  <div className="flex items-center justify-end gap-1.5 shrink-0 flex-wrap max-w-[150px] sm:max-w-none">
                    {/* Status dropdown */}
                    <select
                      value={trip.status}
                      onChange={(e) => handleUpdateStatus(trip.id, e.target.value as TripStatus)}
                      disabled={updatingId === trip.id}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white/60 focus:outline-none focus:ring-1 focus:ring-amz-dourado/50 disabled:opacity-50 max-w-[130px]"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicada</option>
                      <option value="full">Lotada</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="completed">Concluída</option>
                    </select>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(trip)}
                      disabled={updatingId === trip.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-amz-oceano hover:bg-amz-oceano/10 transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

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

      {/* Edit Modal */}
      {editingTrip && (
        <ModalShell onClose={() => setEditingTrip(null)} title="Editar trip">
          <div className="space-y-4">
            <FormField label="Título">
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Nome da expedição"
              />
            </FormField>
            <FormField label="Destino">
              <Input
                value={editForm.destination}
                onChange={(e) => setEditForm((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="Ex: Lençóis Maranhenses, MA"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Início">
                <Input
                  type="date"
                  value={editForm.start_date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, start_date: e.target.value }))}
                />
              </FormField>
              <FormField label="Fim">
                <Input
                  type="date"
                  value={editForm.end_date}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, end_date: e.target.value }))}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Máx. participantes">
                <Input
                  type="number"
                  min="1"
                  value={editForm.max_participants}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, max_participants: e.target.value }))}
                  placeholder="Ex: 8"
                />
              </FormField>
              <FormField label="Visibilidade">
                <select
                  value={editForm.visibility}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
                >
                  <option value="public">Pública</option>
                  <option value="private">Privada</option>
                </select>
              </FormField>
            </div>
            <FormField label="URL da capa">
              <Input
                value={editForm.cover_url}
                onChange={(e) => setEditForm((prev) => ({ ...prev, cover_url: e.target.value }))}
                placeholder="https://..."
              />
            </FormField>
            <div className="flex gap-3 pt-2">
              <GhostButton onClick={() => setEditingTrip(null)} className="flex-1">
                Cancelar
              </GhostButton>
              <PrimaryButton onClick={handleSaveEdit} disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </PrimaryButton>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  )
}
