import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../services/supabase'
import { Toast, ConfirmModal, EmptyState } from './SharedUI'
import type { Order, OrderStatus } from '../../services/payment'

type StatusFilter = 'all' | OrderStatus

interface OrderRow extends Order {
  user_name: string | null
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function OrdersManager() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

      if (error) throw error
      const rows = (data ?? []) as Order[]

      const userIds = [...new Set(rows.map((o) => o.user_id))]
      let nameMap = new Map<string, string>()
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name || 'Rider']))
      }

      setOrders(rows.map((o) => ({ ...o, user_name: nameMap.get(o.user_id) ?? null })))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message: 'Falha ao carregar pedidos: ' + message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id)
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (error) throw error
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      setToast({ message: `Pedido marcado como ${statusLabels[status].toLowerCase()}!`, type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) throw error
      setOrders((prev) => prev.filter((o) => o.id !== id))
      setToast({ message: 'Pedido excluído!', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setToast({ message, type: 'error' })
    } finally {
      setConfirmDelete(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!q) return true
      return (
        o.id.toLowerCase().includes(q) ||
        o.user_id.toLowerCase().includes(q) ||
        o.item_id.toLowerCase().includes(q) ||
        (o.user_name ?? '').toLowerCase().includes(q)
      )
    })
  }, [orders, statusFilter, query])

  const revenue = useMemo(() => {
    const paid = orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + Number(o.amount), 0)
    const pending = orders.filter((o) => o.status === 'pending').reduce((sum, o) => sum + Number(o.amount), 0)
    return { paid, pending, total: orders.length }
  }, [orders])

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `Todos (${orders.length})` },
    { key: 'paid', label: `Pagos (${orders.filter((o) => o.status === 'paid').length})` },
    { key: 'pending', label: `Pendentes (${orders.filter((o) => o.status === 'pending').length})` },
    { key: 'cancelled', label: `Cancelados (${orders.filter((o) => o.status === 'cancelled').length})` },
  ]

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Excluir pedido"
          message="Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
          danger
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pedidos e Reservas</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
          Todos os pedidos do gateway de pagamento (trips e experiências)
        </p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">
            Faturamento (pago)
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatBRL(revenue.paid)}
          </p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">
            A receber (pendente)
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatBRL(revenue.pending)}
          </p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">
            Total de pedidos
          </p>
          <p className="text-2xl font-bold text-amz-dourado mt-1">{revenue.total}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por usuário, nº do pedido ou item..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado transition-all"
        />
        <svg
          className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === f.key
                ? 'bg-amz-dourado text-white shadow-md'
                : 'bg-white dark:bg-white/[0.03] text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/[0.06]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/[0.06] animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          message="Nenhum pedido encontrado"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Pedido</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Usuário</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Item</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Valor</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Data</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-white/40">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-white/60">
                        {o.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 dark:text-white/60">
                        {o.user_name ?? `${o.user_id.slice(0, 8)}...`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amz-dourado/10 text-amz-dourado">
                          {o.item_type === 'trip' ? '🧭 Trip' : '🌊 Experiência'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amz-dourado text-xs">
                        {formatBRL(Number(o.amount))}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-white/40">
                        {new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${statusColors[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          {o.status !== 'paid' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'paid')}
                              disabled={updatingId === o.id}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              Pago
                            </button>
                          )}
                          {o.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'cancelled')}
                              disabled={updatingId === o.id}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(o.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Excluir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((o) => (
              <div
                key={o.id}
                className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {o.user_name ?? 'Rider'} · {formatBRL(Number(o.amount))}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/30 font-mono">
                      #{o.id.slice(0, 8)} · {o.item_type === 'trip' ? '🧭 Trip' : '🌊 Experiência'} ·{' '}
                      {new Date(o.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>
                    {statusLabels[o.status]}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  {o.status !== 'paid' && (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'paid')}
                      disabled={updatingId === o.id}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 disabled:opacity-50"
                    >
                      Marcar pago
                    </button>
                  )}
                  {o.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'cancelled')}
                      disabled={updatingId === o.id}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
