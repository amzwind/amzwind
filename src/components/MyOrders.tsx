import { useEffect, useState } from 'react'
import { listMyOrders, cancelOrder, formatBRL, type Order } from '../services/payment'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

export default function MyOrders({ refreshKey = 0 }: { refreshKey?: number }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await listMyOrders()
        if (!cancelled) setOrders(data)
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Falha ao carregar reservas.'
          // Tabela ainda não aplicada no Supabase: exibe estado vazio amigável
          if (msg.includes('migration')) {
            setOrders([])
            setError('')
          } else {
            setError(msg)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  async function handleCancel(orderId: string) {
    if (!window.confirm('Cancelar esta reserva?')) return
    setCancellingId(orderId)
    try {
      const updated = await cancelOrder(orderId)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao cancelar reserva.')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia">Minhas Reservas</h3>
        <span className="text-xs text-amz-terra-light dark:text-amz-areia/40">
          {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-8 text-center border border-amz-areia-dark/20 dark:border-white/5">
          <div className="text-3xl mb-2">🧾</div>
          <p className="text-sm text-amz-terra-light dark:text-amz-areia/40">
            Você ainda não possui reservas pagas por aqui.
          </p>
          <p className="text-xs text-amz-terra-light dark:text-amz-areia/30 mt-1">
            Reserve uma trip ou experiência para vê-la listada neste painel.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 p-4 flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-amz-dourado/10 flex items-center justify-center text-lg shrink-0">
              {order.item_type === 'trip' ? '🧭' : '🌊'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">
                {order.item_type === 'trip' ? 'Trip' : 'Experiência'} · {order.item_id.slice(0, 12)}
              </p>
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                · {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'card' ? 'Cartão' : '—'}
              </p>
              <p className="text-sm font-bold text-amz-dourado mt-0.5">{formatBRL(order.amount)}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${statusColors[order.status] ?? statusColors.pending}`}
              >
                {statusLabels[order.status] ?? order.status}
              </span>
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={cancellingId === order.id}
                  className="text-[11px] font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {cancellingId === order.id ? 'Cancelando…' : 'Cancelar'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
