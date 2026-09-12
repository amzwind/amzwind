import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useCart, type CartItem } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import TripCalendar from './TripCalendar'
import { Toast } from './admin/SharedUI'

type Experience = Tables<'experiences'>
type Product = Tables<'products'>

const CART_STORAGE_KEY = 'amzwind-cart'

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

interface StoredCart {
  items: CartItem[]
  checkIn: string | null
  checkOut: string | null
}

function loadCart(): StoredCart | null {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredCart
  } catch {
    return null
  }
}

function saveCart(items: CartItem[], checkIn: string | null, checkOut: string | null) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, checkIn, checkOut }))
}

export default function CartCheckout() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const {
    items, checkIn, checkOut, nights, basePricePerNight,
    addItem, removeItem, updateQuantity, setCheckIn, setCheckOut,
    clearCart, getAccommodationTotal, getTotal, getSubtotal,
  } = useCart()

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [activePicker, setActivePicker] = useState<'none' | 'experience' | 'product'>('none')
  const [loaded, setLoaded] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)

  const [sessionUserId, setSessionUserId] = useState<string | null>(null)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestMsg, setGuestMsg] = useState('')
  const [successIds, setSuccessIds] = useState<string[]>([])

  useEffect(() => {
    async function init() {
      const [{ data: { session } }, eRes, pRes] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from('experiences').select('*').order('title'),
        supabase.from('products').select('*').order('title'),
      ])
      if (session) {
        setSessionUserId(session.user.id)
        setSessionEmail(session.user.email || null)
      }

      if (eRes.error) {
        console.error('[CartCheckout] Error loading experiences:', eRes.error)
      } else if (eRes.data) {
        setExperiences(eRes.data)
      }

      if (pRes.error) {
        console.error('[CartCheckout] Error loading products:', pRes.error)
      } else if (pRes.data) {
        setProducts(pRes.data)
      }

      setCatalogLoading(false)

      const stored = loadCart()
      if (stored && items.length === 0) {
        stored.items.forEach((item) => addItem(item))
        if (stored.checkIn) setCheckIn(stored.checkIn)
        if (stored.checkOut) setCheckOut(stored.checkOut)
      }
      setLoaded(true)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { loaded && saveCart(items, checkIn, checkOut) }, [items, checkIn, checkOut, loaded])

  async function handleGoogleLogin() {
    setAuthLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) { setAuthError(error.message); setAuthLoading(false) }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
        if (error) throw error
        setSessionUserId(data.user.id)
        setSessionEmail(data.user.email || null)
        setShowAuthModal(false)
      } else {
        const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword })
        if (error) throw error
        if (data.user) {
          setSessionUserId(data.user.id)
          setSessionEmail(data.user.email || null)
        }
        setShowAuthModal(false)
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
    }
    setAuthLoading(false)
  }

  async function handleForgotPassword() {
    if (!authEmail) { setAuthError('Enter your email first'); return }
    setAuthLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail)
    if (error) setAuthError(error.message)
    else setAuthError('Check your email for reset link')
    setAuthLoading(false)
  }

  function handleGuestCheckout() {
    setShowAuthModal(false)
  }

  const isGuest = !sessionUserId

  function validate(): string | null {
    if (items.length === 0) return t.cartEmpty
    const hasInvalidId = items.some((item) => !isValidUUID(item.id))
    if (hasInvalidId) return 'Some items have invalid IDs. Please remove and re-add them.'
    if (isGuest) {
      if (!guestName.trim()) return t.checkoutNameRequired
      if (!guestEmail.trim()) return t.checkoutEmailRequired
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) return t.checkoutEmailInvalid
    }
    return null
  }

  async function handleCheckout() {
    if (isGuest && !showAuthModal && items.length > 0) {
      setShowAuthModal(true)
      return
    }

    const err = validate()
    if (err) { setToast({ message: err, type: 'error' }); return }

    setSubmitting(true)
    const userId = sessionUserId || null

    const accommodation = nights > 0 ? {
      check_in: checkIn,
      check_out: checkOut,
      nights,
      base_price_per_night: basePricePerNight,
      total: getAccommodationTotal(),
    } : null

    const contact = isGuest ? {
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      message: guestMsg.trim(),
    } : null

    const notes = JSON.stringify({
      items: items.map((i) => ({
        id: i.id,
        type: i.type,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      accommodation,
      contact,
      subtotal: getSubtotal(),
      total: getTotal(),
    })

    const bookingDate = checkIn || new Date().toISOString().slice(0, 10)

    const bookingPromises = items.map((item) =>
      supabase.from('bookings').insert({
        user_id: userId,
        item_type: item.type,
        item_id: isValidUUID(item.id) ? item.id : null,
        status: 'pending',
        booking_date: bookingDate,
        notes,
      }).select('id')
    )

    const results = await Promise.all(bookingPromises)
    const errors: { item: CartItem; error: { message: string; code?: string; details?: string; hint?: string } }[] = []
    const ids: string[] = []

    for (let i = 0; i < results.length; i++) {
      const r = results[i]
      if (r.error) {
        console.error(`[CartCheckout] Booking insert error for "${items[i].title}" (${items[i].type}):`, {
          message: r.error.message, code: r.error.code, details: r.error.details, hint: r.error.hint, fullError: r.error,
        })
        errors.push({ item: items[i], error: r.error })
      } else if (r.data && r.data.length > 0) {
        ids.push(r.data[0].id)
      }
    }

    if (errors.length > 0) {
      const firstErr = errors[0]
      const detail = firstErr.error.code ? ` [${firstErr.error.code}]` : ''
      setToast({ message: `${t.checkoutError} (${errors.length})${detail}: ${firstErr.error.message}`, type: 'error' })
    } else {
      const financialPromises = items.map((item) =>
        supabase.from('financial_accounts' as any).insert({
          account_type: 'receivable',
          description: `Reserva - ${item.title}`,
          amount: item.price * item.quantity,
          due_date: bookingDate,
          status: 'pending',
        })
      )
      const finResults = await Promise.all(financialPromises)
      const finErrors = finResults.filter((r) => r.error)
      if (finErrors.length > 0) console.error('[CartCheckout] Financial account insert errors:', finErrors)
      setSuccessIds(ids)
      clearCart()
      localStorage.removeItem(CART_STORAGE_KEY)
    }
    setSubmitting(false)
  }

  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  if (successIds.length > 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-maybug text-amz-terra dark:text-amz-areia mb-3">{t.checkoutSuccess}</h1>
        <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mb-2 max-w-md">{t.checkoutSuccessDetail}</p>
        {successIds.length > 0 && <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mb-6">#{successIds.slice(0, 3).join(' · #')}</p>}
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-amz-areia-dark/20 dark:border-white/10 text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors">{t.navHome}</button>
          <button onClick={() => navigate('/minha-conta')} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors">{t.cartMyBookings}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white dark:bg-[#1a0f08] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.06] w-full max-w-md p-6 sm:p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amz-dourado/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.checkoutLoginTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-white/40 mt-1">{t.checkoutLoginSubtitle}</p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 text-center">{authError}</div>
            )}

            <button onClick={handleGoogleLogin} disabled={authLoading} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t.checkoutLoginGoogle}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-400 dark:text-white/30">{t.checkoutLoginDivider}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder={t.checkoutLoginEmail}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
              <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder={t.checkoutLoginPassword}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={handleForgotPassword} className="text-amz-dourado hover:underline">{t.checkoutLoginForgot}</button>
                <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-amz-dourado hover:underline">
                  {authMode === 'login' ? t.checkoutLoginNoAccount : t.checkoutLoginButton}
                </button>
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all disabled:opacity-50">
                {authLoading ? '...' : authMode === 'login' ? t.checkoutLoginButton : 'Criar conta'}
              </button>
            </form>

            <button onClick={handleGuestCheckout} className="w-full py-2 text-xs font-semibold text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
              {t.checkoutGuest}
            </button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.cartTitle}</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          {sessionUserId ? (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {t.checkoutLoggedInAs} {sessionEmail}
            </span>
          ) : items.length > 0 ? `${items.length} ${t.cartItemCount}` : t.cartEmpty}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <TripCalendar checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />

          <div className="flex gap-2">
            <button onClick={() => setActivePicker(activePicker === 'experience' ? 'none' : 'experience')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activePicker === 'experience' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40'}`}>
              + {t.cartAddExperience}
            </button>
            <button onClick={() => setActivePicker(activePicker === 'product' ? 'none' : 'product')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activePicker === 'product' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40'}`}>
              + {t.cartAddProduct}
            </button>
          </div>

          {activePicker === 'experience' && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 space-y-2 max-h-64 overflow-y-auto">
              {catalogLoading && <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4 animate-pulse">Carregando...</p>}
              {!catalogLoading && experiences.length === 0 && <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4">Nenhuma experiencia disponivel</p>}
              {!catalogLoading && experiences.map((exp) => (
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
              {catalogLoading && <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4 animate-pulse">Carregando...</p>}
              {!catalogLoading && products.length === 0 && <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4">Nenhum produto disponivel</p>}
              {!catalogLoading && products.map((prod) => (
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

          {isGuest && items.length > 0 && (
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.checkoutContactInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1.5">{t.checkoutName} <span className="text-red-500">*</span></label>
                  <input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1.5">{t.checkoutEmail} <span className="text-red-500">*</span></label>
                  <input type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1.5">{t.checkoutPhone}</label>
                  <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1.5">{t.checkoutMessage}</label>
                  <input type="text" value={guestMsg} onChange={(e) => setGuestMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.cartSummary}</h3>

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
                  <span className="text-gray-700 dark:text-white/60">{t.cartAccommodation}</span>
                  <span className="text-amz-dourado">{formatBRL(getAccommodationTotal())}</span>
                </div>
              </div>
            )}

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

            {items.length > 0 && (
              <>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <span className="text-gray-500 dark:text-white/40">{t.cartSubtotal}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatBRL(getSubtotal())}</span>
                </div>
                {nights > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-white/40">{t.cartAccommodation}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatBRL(getAccommodationTotal())}</span>
                  </div>
                )}
              </>
            )}

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
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.checkoutProcessing}
                </span>
              ) : isGuest ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  {t.checkoutLoginTitle}
                </span>
              ) : (
                t.cartCheckout
              )}
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
