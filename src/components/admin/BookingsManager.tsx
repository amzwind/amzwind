import { useState, useEffect } from 'react'
import { supabase, type Tables } from '../../services/supabase'
import { useLanguage } from '../../contexts/LanguageContext'
import { StatusBadge, EmptyState, Toast, ConfirmModal, ModalShell, FormField, Input, PrimaryButton, GhostButton } from './SharedUI'

type Booking = Tables<'bookings'>
type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled'

function parseNotes(notes: string | null): Record<string, any> | null {
  if (!notes) return null
  try { return JSON.parse(notes) } catch { return null }
}

export function BookingsManager() {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: 'confirmed' | 'cancelled' } | null>(null)

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ status: '', booking_date: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)

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

  function openDetail(booking: Booking) {
    setSelectedBooking(booking)
    setEditForm({
      status: booking.status,
      booking_date: booking.booking_date,
      notes: booking.notes || '',
    })
    setEditModalOpen(true)
  }

  async function handleSaveEdit() {
    if (!selectedBooking) return
    setSaving(true)
    const { error } = await supabase
      .from('bookings')
      .update({
        status: editForm.status as Booking['status'],
        booking_date: editForm.booking_date,
        notes: editForm.notes || null,
      })
      .eq('id', selectedBooking.id)

    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'Reserva atualizada com sucesso!', type: 'success' })
      setEditModalOpen(false)
      setSelectedBooking(null)
      await loadData()
    }
    setSaving(false)
  }

  async function handleDeleteBooking() {
    if (!deleteTarget) return
    const { error } = await supabase.from('bookings').delete().eq('id', deleteTarget.id)
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'Reserva excluída.', type: 'success' })
      setEditModalOpen(false)
      setSelectedBooking(null)
      await loadData()
    }
    setDeleteTarget(null)
  }

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter)

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: t.adminBookFilterAll, count: bookings.length },
    { key: 'pending', label: t.adminBookFilterPending, count: bookings.filter((b) => b.status === 'pending').length },
    { key: 'confirmed', label: t.adminBookFilterConfirmed, count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'cancelled', label: t.adminBookFilterCancelled, count: bookings.filter((b) => b.status === 'cancelled').length },
  ]

  const typeIcon = (type: string) => type === 'experience' ? '🌊' : type === 'class' ? '🎓' : '📦'
  const typeName = (type: string) => type === 'experience' ? 'Experiência' : type === 'class' ? 'Aula' : 'Produto'

  const extractClientInfo = (booking: Booking) => {
    const notes = parseNotes(booking.notes)
    return {
      name: notes?.contact?.name || notes?.contact_name || null,
      email: notes?.contact?.email || notes?.contact_email || null,
      whatsapp: notes?.contact_whatsapp || notes?.whatsapp || null,
      phone: notes?.contact_phone || notes?.contact_phone || null,
      items: notes?.items || [],
      paymentConfirmed: notes?.payment_confirmed || false,
    }
  }

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

      <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-1 pb-1 -mx-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key ? 'bg-amz-dourado text-white shadow-md' : 'bg-white dark:bg-white/[0.03] text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1]'
            }`}>
            {f.label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} message={t.adminBookNoData} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                  {filtered.map((b) => {
                    const info = extractClientInfo(b)
                    return (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => openDetail(b)}>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amz-dourado/10 text-amz-dourado">
                            {typeIcon(b.item_type)} {typeName(b.item_type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-white/60 text-xs">
                          {info.name || (b.user_id ? `${b.user_id.slice(0, 8)}...` : 'Guest')}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-white/40 text-xs">
                          {new Date(b.booking_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3 text-right">
                          {b.status === 'pending' && (
                            <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => setConfirmAction({ id: b.id, status: 'confirmed' })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">{t.adminBookConfirm}</button>
                              <button onClick={() => setConfirmAction({ id: b.id, status: 'cancelled' })} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">{t.adminBookCancel}</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((b) => {
              const info = extractClientInfo(b)
              return (
                <div key={b.id} onClick={() => openDetail(b)} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 space-y-3 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcon(b.item_type)}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{typeName(b.item_type)}</p>
                        <p className="text-xs text-gray-400 dark:text-white/30">{new Date(b.booking_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  {info.name && (
                    <p className="text-xs text-gray-500 dark:text-white/40">
                      <span className="font-medium text-gray-700 dark:text-white/60">{info.name}</span>
                    </p>
                  )}
                  {info.whatsapp && (
                    <p className="text-xs text-gray-400 dark:text-white/30">📱 {info.whatsapp}</p>
                  )}
                  {info.paymentConfirmed && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pagamento confirmado
                    </div>
                  )}
                  {b.status === 'pending' && (
                    <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setConfirmAction({ id: b.id, status: 'confirmed' })} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 active:scale-[0.97] transition-all">
                        {t.adminBookConfirm}
                      </button>
                      <button onClick={() => setConfirmAction({ id: b.id, status: 'cancelled' })} className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 active:scale-[0.97] transition-all">
                        {t.adminBookCancel}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Detail/Edit Modal */}
      {editModalOpen && selectedBooking && (
        <ModalShell onClose={() => { setEditModalOpen(false); setSelectedBooking(null) }} title="Detalhes da Reserva">
          <div className="space-y-4">
            {/* Client Info */}
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-2">Informações do Cliente</h4>
              {(() => {
                const info = extractClientInfo(selectedBooking)
                return (
                  <div className="space-y-1.5 text-sm">
                    {info.name && <p className="text-gray-900 dark:text-white"><span className="text-gray-400 dark:text-white/30 text-xs">Nome:</span> {info.name}</p>}
                    {info.email && <p className="text-gray-900 dark:text-white"><span className="text-gray-400 dark:text-white/30 text-xs">Email:</span> {info.email}</p>}
                    {info.whatsapp && <p className="text-gray-900 dark:text-white"><span className="text-gray-400 dark:text-white/30 text-xs">WhatsApp:</span> {info.whatsapp}</p>}
                    {info.phone && <p className="text-gray-900 dark:text-white"><span className="text-gray-400 dark:text-white/30 text-xs">Telefone:</span> {info.phone}</p>}
                    {!info.name && !info.email && !info.whatsapp && !info.phone && (
                      <p className="text-gray-400 dark:text-white/30 text-xs italic">Nenhuma informação de contato registrada</p>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-2">Detalhes da Reserva</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 dark:text-white/30 text-xs">Tipo</p>
                  <p className="text-gray-900 dark:text-white font-medium">{typeIcon(selectedBooking.item_type)} {typeName(selectedBooking.item_type)}</p>
                </div>
                <div>
                  <p className="text-gray-400 dark:text-white/30 text-xs">ID do Item</p>
                  <p className="text-gray-900 dark:text-white font-mono text-xs">{selectedBooking.item_id?.slice(0, 12) || '—'}</p>
                </div>
              </div>
              {(() => {
                const info = extractClientInfo(selectedBooking)
                if (info.items.length === 0) return null
                return (
                  <div className="mt-2">
                    <p className="text-gray-400 dark:text-white/30 text-xs mb-1">Itens Reservados</p>
                    {info.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs py-1">
                        <span className="text-gray-700 dark:text-white/60">{item.title}</span>
                        <span className="text-amz-dourado font-semibold">R$ {Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Editable Fields */}
            <FormField label="Status">
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
              >
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </FormField>

            <FormField label="Data da Reserva">
              <Input
                type="date"
                value={editForm.booking_date}
                onChange={(e) => setEditForm((prev) => ({ ...prev, booking_date: e.target.value }))}
              />
            </FormField>

            <FormField label="Notas / Observações">
              <textarea
                rows={3}
                value={editForm.notes}
                onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors resize-none"
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <GhostButton onClick={() => { setEditModalOpen(false); setSelectedBooking(null) }} className="flex-1">
                Cancelar
              </GhostButton>
              <button
                onClick={() => setDeleteTarget(selectedBooking)}
                className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                Excluir
              </button>
              <PrimaryButton onClick={handleSaveEdit} disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </PrimaryButton>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          title="Excluir Reserva"
          message={`Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteBooking}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
