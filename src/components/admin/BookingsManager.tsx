import { useState, useEffect } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { StatusBadge, EmptyState, Toast, ConfirmModal } from './SharedUI'

type Booking = Tables<'bookings'>

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled'

export function BookingsManager() {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: 'confirmed' | 'cancelled' } | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (data) setBookings(data)
  }

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) setToast({ message: error.message, type: 'error' })
    else { setToast({ message: status === 'confirmed' ? t.adminBookConfirmed : t.adminBookCancelled, type: 'success' }); await loadData() }
    setConfirmAction(null)
  }

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter)

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: t.adminBookFilterAll, count: bookings.length },
    { key: 'pending', label: t.adminBookFilterPending, count: bookings.filter((b) => b.status === 'pending').length },
    { key: 'confirmed', label: t.adminBookFilterConfirmed, count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'cancelled', label: t.adminBookFilterCancelled, count: bookings.filter((b) => b.status === 'cancelled').length },
  ]

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.status === 'confirmed' ? t.adminBookConfirm : t.adminBookCancel}
          message={`Deseja ${confirmAction.status === 'confirmed' ? 'confirmar' : 'cancelar'} esta reserva?`}
          onConfirm={() => updateStatus(confirmAction.id, confirmAction.status)}
          onCancel={() => setConfirmAction(null)}
          danger={confirmAction.status === 'cancelled'}
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminBookTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.adminBookSubtitle}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-amz-dourado text-white shadow-md'
                : 'bg-white dark:bg-white/[0.03] text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1]'
            }`}
          >
            {f.label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} message={t.adminBookNoData} />
      ) : (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
          <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">{t.adminBookType}</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">{t.adminBookClient}</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">{t.adminBookDate}</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">{t.adminBookStatus}</th>
                  <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">{t.adminBookActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amz-dourado/10 text-amz-dourado">
                        {b.item_type === 'experience' ? '🌊 Experiência' : b.item_type === 'class' ? '🎓 Aula' : '📦 Produto'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-white/60 font-mono text-xs">{b.user_id ? `${b.user_id.slice(0, 8)}...` : 'Guest'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-white/40 text-xs">
                      {new Date(b.booking_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'pending' && (
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => setConfirmAction({ id: b.id, status: 'confirmed' })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">{t.adminBookConfirm}</button>
                          <button onClick={() => setConfirmAction({ id: b.id, status: 'cancelled' })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">{t.adminBookCancel}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
