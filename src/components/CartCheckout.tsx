import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useCart, type CartItemType } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Toast } from './admin/SharedUI'

function getItemLink(item: { id: string; type: string }): string {
  if (item.type === 'experience') return `/experiencia/${item.id}`
  if (item.type === 'product') return `/produto/${item.id}`
  return '/aula/iniciante'
}

function getItemTypeLabel(type: CartItemType, t: any): string {
  if (type === 'experience') return t.expLabel || 'Experiência'
  if (type === 'product') return t.prodCategoryTitle || 'Produto'
  return t.customerTypeClass || 'Aula'
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function CartCheckout() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart()

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sessionUserId, setSessionUserId] = useState<string | null>(null)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [successIds, setSuccessIds] = useState<string[]>([])
  const [checkoutWhatsApp, setCheckoutWhatsApp] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionUserId(session.user.id)
        setSessionEmail(session.user.email || null)
      }
    })
  }, [])

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

  function handleProceedToCheckout() {
    if (items.length === 0) {
      setToast({ message: 'Adicione um item ao carrinho primeiro', type: 'error' })
      return
    }
    if (!checkoutWhatsApp.trim()) {
      setToast({ message: 'Informe seu WhatsApp para contato.', type: 'error' })
      return
    }
    if (!sessionUserId) {
      setShowAuthModal(true)
      return
    }
    setShowPaymentModal(true)
  }

  async function handlePaymentConfirm() {
    setPaymentProcessing(true)
    setShowPaymentModal(false)

    const userId = sessionUserId
    const bookingDate = items[0]?.booking_date || new Date().toISOString().slice(0, 10)

    const notes = JSON.stringify({
      items: items.map((i) => ({ id: i.id, type: i.type, title: i.title, price: i.price, quantity: i.quantity, booking_date: i.booking_date })),
      contact_whatsapp: checkoutWhatsApp.trim(),
      payment_confirmed: true,
      payment_method: 'simulated',
      payment_date: new Date().toISOString(),
    })

    const bookingPromises = items.map((item) =>
      supabase.from('bookings').insert({
        user_id: userId,
        item_type: item.type,
        item_id: item.id,
        status: 'confirmed',
        booking_date: item.booking_date || bookingDate,
        notes,
      }).select('id')
    )

    const results = await Promise.all(bookingPromises)
    const errors: string[] = []
    const ids: string[] = []

    for (const r of results) {
      if (r.error) errors.push(r.error.message)
      else if (r.data && r.data.length > 0) ids.push(r.data[0].id)
    }

    if (errors.length > 0) {
      setToast({ message: `${t.checkoutError}: ${errors[0]}`, type: 'error' })
    } else {
      setSuccessIds(ids)
      clearCart()
    }
    setPaymentProcessing(false)
  }

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
    <div className="space-y-6">
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
          </div>
        </div>
      )}

      {/* Header */}
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

      {items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.cartEmpty}</h2>
          <p className="text-sm text-gray-400 dark:text-white/30 mb-6 max-w-sm mx-auto">
            Explore nossas experiências, produtos e aulas e adicione itens ao carrinho para reservar.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/experiencias" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors">
              {t.expLabel}
            </Link>
            <Link to="/produtos" className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              {t.prodCategoryTitle}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <Link to={getItemLink(item)} className="flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-2xl">
                      {item.type === 'experience' ? '🧭' : item.type === 'product' ? '📦' : '🪁'}
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={getItemLink(item)} className="block">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:text-amz-dourado transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                    {getItemTypeLabel(item.type, t)}
                  </p>
                  {item.booking_date && (
                    <p className="text-xs text-amz-dourado mt-1">
                      📅 {new Date(item.booking_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm font-bold text-amz-dourado">
                      {formatBRL(item.price)}
                    </p>
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => { removeItem(item.id, item.type); setToast({ message: 'Item removido do carrinho', type: 'success' }) }}
                  className="flex-shrink-0 p-2 rounded-xl text-gray-400 dark:text-white/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar: Checkout Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Resumo da Reserva</h3>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-white/40 truncate max-w-[180px]">
                      {item.title} {item.quantity > 1 ? `x${item.quantity}` : ''}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatBRL(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-amz-dourado">{formatBRL(getSubtotal())}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/60 mb-1.5">
                  WhatsApp para contato <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={checkoutWhatsApp}
                  onChange={(e) => setCheckoutWhatsApp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                />
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={paymentProcessing}
                className="w-full py-3 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.checkoutProcessing}
                  </span>
                ) : !sessionUserId ? (
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
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white dark:bg-[#1a0f08] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.06] w-full max-w-md p-6 sm:p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amz-dourado/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Pagamento</h2>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-2">
                Valor total: <span className="font-bold text-amz-dourado">{formatBRL(getSubtotal())}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                Pagamento simulado para fins de demonstração
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-white/40">Itens:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/40">Total:</span>
                  <span className="font-bold text-amz-dourado">{formatBRL(getSubtotal())}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Cancelar
                </button>
                <button onClick={handlePaymentConfirm} disabled={paymentProcessing} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50">
                  {paymentProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    'Confirmar Pagamento'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
