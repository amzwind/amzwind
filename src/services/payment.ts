import { supabase } from './supabase'

export type OrderItemType = 'trip' | 'experience'
export type OrderStatus = 'pending' | 'paid' | 'cancelled'
export type PaymentMethod = 'pix' | 'card'

export interface Order {
  id: string
  user_id: string
  item_type: OrderItemType
  item_id: string
  amount: number
  currency: string
  status: OrderStatus
  payment_provider_id: string | null
  payment_method: PaymentMethod | null
  created_at: string
  updated_at: string
}

export interface CreateOrderParams {
  item_type: OrderItemType
  item_id: string
  amount: number
  currency?: string
  payment_method?: PaymentMethod
}

function generateSimulatedProviderId(method: PaymentMethod): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `sim_${method}_${Date.now()}_${rand}`
}

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    item_type: row.item_type as OrderItemType,
    item_id: String(row.item_id),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? 'BRL'),
    status: (row.status as OrderStatus) ?? 'pending',
    payment_provider_id: (row.payment_provider_id as string | null) ?? null,
    payment_method: (row.payment_method as PaymentMethod | null) ?? null,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  }
}

/**
 * Inicia um pedido de checkout (status inicial `pending`).
 * O `payment_provider_id` é simulado nesta fase (Pix / Cartão).
 */
export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado. Faça login para concluir a reserva.')

  if (!params.item_id) throw new Error('Item inválido para checkout.')
  if (params.item_type !== 'trip' && params.item_type !== 'experience') {
    throw new Error('Tipo de item inválido. Use trip ou experience.')
  }
  if (!Number.isFinite(params.amount) || params.amount < 0) {
    throw new Error('Valor inválido para checkout.')
  }

  const method: PaymentMethod = params.payment_method ?? 'pix'

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      item_type: params.item_type,
      item_id: params.item_id,
      amount: params.amount,
      currency: params.currency ?? 'BRL',
      status: 'pending',
      payment_provider_id: generateSimulatedProviderId(method),
      payment_method: method,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(
      'Falha ao iniciar checkout. Aplique a migration 20260914040000_create_orders_table no Supabase. Detalhe: ' +
        error.message,
    )
  }
  return toOrder(data as Record<string, unknown>)
}

/** Busca os pedidos do usuário logado (mais recentes primeiro). */
export async function listMyOrders(): Promise<Order[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado.')

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(
      'Falha ao carregar reservas. Aplique a migration 20260914040000_create_orders_table no Supabase. Detalhe: ' +
        error.message,
    )
  }
  return ((data ?? []) as Record<string, unknown>[]).map(toOrder)
}

/** Atualiza o status da reserva (ex.: paid após confirmação, cancelled). */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado.')

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) throw new Error('Falha ao atualizar reserva: ' + error.message)
  return toOrder(data as Record<string, unknown>)
}

/** Marca o pedido como pago (confirmação simulada do gateway). */
export async function markOrderAsPaid(orderId: string): Promise<Order> {
  return updateOrderStatus(orderId, 'paid')
}

/** Cancela uma reserva do próprio usuário. */
export async function cancelOrder(orderId: string): Promise<Order> {
  return updateOrderStatus(orderId, 'cancelled')
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
