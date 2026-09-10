import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import TripCalendar from './TripCalendar'
import { Toast } from './admin/SharedUI'

type Experience = Tables<'experiences'>
type Product = Tables<'products'>

export default function CartCheckout() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const {
    items, checkIn, checkOut, nights, basePricePerNight,
    addItem, removeItem, updateQuantity, setCheckIn, setCheckOut,
    clearCart, getAccommodationTotal, getTotal,
  } = useCart()

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [activePicker, setActivePicker] = useState<'none' | 'experience' | 'product'>('none')

  useEffect(() => {
    async function load() {
      const [eRes, pRes] = await Promise.all([
        supabase.from('experiences').select('*').order('title'),
        supabase.from('products').select('*').order('title'),
      ])
      if (eRes.data) setExperiences(eRes.data)
      if (pRes.data) setProducts(pRes.data)
    }
    load()
  }, [])

  async function handleCheckout() {
    if (items.length === 0) return
    setSubmitting(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setToast({ message: 'Faça login para finalizar a reserva.', type: 'error' })
      setSubmitting(false)
      return
    }

    const bookingPromises = items.map((item) =>
      supabase.from('bookings').insert({
        user_id: session.user.id,
        item_type: item.type,
        item_id: item.id,
        status: 'pending',
        booking_date: checkIn || new Date().toISOString(),
        notes: `${item.title} x${item.quantity}${nights > 0 ? ` | ${nights} noites` : ''}`,
      })
    )

    const results = await Promise.all(bookingPromises)
    const errors = results.filter((r) => r.error)

    if (errors.length > 0) {
      setToast({ message: `Erro ao criar ${errors.length} reserva(s).`, type: 'error' })
    } else {
      setToast({ message: `${bookingPromises.length} reserva(s) criada(s)!`, type: 'success' })
      clearCart()
    }

    setSubmitting(false)
  }

  const formatBRL = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.cartTitle}</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          {items.length > 0 ? `${items.length} item(s) no carrinho` : t.cartEmpty}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Picker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar */}
          <TripCalendar checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />

          {/* Add items */}
          <div className="flex gap-2">
            <button onClick={() => setActivePicker(activePicker === 'experience' ? 'none' : 'experience')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activePicker === 'experience' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40'}`}>
              + {t.cartAddExperience}
            </button>
            <button onClick={() => setActivePicker(activePicker === 'product' ? 'none' : 'product')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activePicker === 'product' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40'}`}>
              + {t.cartAddProduct}
            </button>
          </div>

          {/* Picker panels */}
          {activePicker === 'experience' && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 space-y-2 max-h-64 overflow-y-auto">
              {experiences.map((exp) => (
                <button key={exp.id} onClick={() => { addItem({ id: exp.id, type: 'experience', title: exp.title, price: exp.price, image_url: exp.image_url }); setActivePicker('none') }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-left">
                  {exp.image_url && <img src={exp.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{exp.title}</p>
                    <p className="text-xs text-amz-dourado font-bold">{formatBRL(exp.price)}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              ))}
            </div>
          )}

          {activePicker === 'product' && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 space-y-2 max-h-64 overflow-y-auto">
              {products.map((prod) => (
                <button key={prod.id} onClick={() => { addItem({ id: prod.id, type: 'product', title: prod.title, price: prod.price, image_url: prod.image_url }); setActivePicker('none') }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors text-left">
                  {prod.image_url && <img src={prod.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{prod.title}</p>
                    <p className="text-xs text-amz-dourado font-bold">{formatBRL(prod.price)}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              ))}
            </div>
          )}

          {/* Cart items */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] divide-y divide-gray-50 dark:divide-white/[0.03]">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 p-4">
                  {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 dark:text-white/30">{formatBRL(item.price)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-xs">−</button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-xs">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id, item.type)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Resumo</h3>

            {/* Accommodation */}
            {nights > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/40">{t.cartBasePrice}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatBRL(basePricePerNight)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/40">{t.cartNights}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">×{nights}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700 dark:text-white/60">Hospedagem</span>
                  <span className="text-amz-dourado">{formatBRL(getAccommodationTotal())}</span>
                </div>
              </div>
            )}

            {/* Items subtotal */}
            {items.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-white/40 truncate max-w-[150px]">{item.title} ×{item.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatBRL(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06]">
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t.cartTotal}</span>
                <span className="text-xl font-bold text-amz-dourado">{formatBRL(getTotal())}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || submitting}
              className="w-full py-3 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : t.cartCheckout}
            </button>

            <button onClick={() => navigate(-1)} className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
              ← {t.adminBack}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
