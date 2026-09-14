import { useEffect, useState } from 'react'
import {
  createOrder,
  markOrderAsPaid,
  formatBRL,
  type Order,
  type OrderItemType,
  type PaymentMethod,
} from '../services/payment'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  itemType: OrderItemType
  itemId: string
  itemTitle: string
  amount: number
  imageUrl?: string | null
  onSuccess?: (order: Order) => void
}

type Step = 'review' | 'processing' | 'success' | 'error'

export default function CheckoutModal({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemTitle,
  amount,
  imageUrl,
  onSuccess,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [step, setStep] = useState<Step>('review')
  const [errorMsg, setErrorMsg] = useState('')
  const [paidOrder, setPaidOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStep('review')
      setErrorMsg('')
      setPaidOrder(null)
      setPaymentMethod('pix')
    }
  }, [isOpen, itemId])

  if (!isOpen) return null

  async function handleConfirm() {
    setStep('processing')
    setErrorMsg('')
    try {
      const order = await createOrder({
        item_type: itemType,
        item_id: itemId,
        amount,
        currency: 'BRL',
        payment_method: paymentMethod,
      })
      // Simulação do gateway: confirma o pagamento após criar o pedido
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const paid = await markOrderAsPaid(order.id)
      setPaidOrder(paid)
      setStep('success')
      onSuccess?.(paid)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Falha ao processar pagamento.')
      setStep('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout da reserva"
    >
      <div
        className="bg-white dark:bg-[#1a0f08] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amz-dourado to-amber-600 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">
            {itemType === 'trip' ? '🧭' : '🌊'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Checkout seguro</h2>
            <p className="text-xs text-white/70 truncate">
              {itemType === 'trip' ? 'Trip' : 'Experiência'} · {itemTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar checkout"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {imageUrl && step === 'review' && (
            <img src={imageUrl} alt={itemTitle} className="w-full h-32 object-cover rounded-2xl" />
          )}

          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-gray-100 dark:border-white/10">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{itemTitle}</p>
              <p className="text-xs text-gray-400 dark:text-white/40">
                {itemType === 'trip' ? 'Reserva de trip' : 'Reserva de experiência'} · BRL
              </p>
            </div>
            <p className="text-lg font-bold text-amz-dourado shrink-0 ml-3">{formatBRL(amount)}</p>
          </div>

          {step === 'review' && (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-white/60 mb-2">
                  Método de pagamento (simulado)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { key: 'pix', icon: '⚡', label: 'PIX' },
                      { key: 'card', icon: '💳', label: 'Cartão' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === m.key
                          ? 'border-amz-dourado bg-amz-dourado/5'
                          : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl">{m.icon}</div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amz-dourado to-amber-500 text-white font-bold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amz-dourado/25 active:scale-[0.98]"
              >
                Confirmar pagamento — {formatBRL(amount)}
              </button>
              <p className="text-[11px] text-center text-gray-400 dark:text-white/30">
                Pagamento simulado nesta fase. Nenhuma cobrança real é efetuada.
              </p>
            </>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-white/60">Processando pagamento simulado…</p>
            </div>
          )}

          {step === 'success' && paidOrder && (
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reserva confirmada!</h3>
              <p className="text-xs text-gray-500 dark:text-white/40 mt-1">
                Pedido #{paidOrder.id.slice(0, 8)} · {formatBRL(paidOrder.amount)} via{' '}
                {paidOrder.payment_method === 'pix' ? 'PIX' : 'Cartão'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-colors"
              >
                Ver Minhas Reservas
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-4 text-center space-y-3">
              <p className="text-sm text-red-500 font-semibold">Não foi possível concluir o pagamento.</p>
              <p className="text-xs text-gray-500 dark:text-white/40">{errorMsg}</p>
              <button
                onClick={() => setStep('review')}
                className="w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-white"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
