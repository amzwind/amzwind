import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useCart, type CartItemType } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { useProfile } from '../hooks/useProfile'
import { Toast } from './admin/SharedUI'

type PaymentMethod = 'pix' | 'card' | 'paypal'

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

const testimonials = [
  { name: 'Marina S.', text: 'Experiência incrível! Tudo foi organizado com perfeição. Recomendo demais!', avatar: '🌊' },
  { name: 'Carlos M.', text: 'Aula de kite sensacional. Segurança e diversão ao mesmo tempo.', avatar: '🪁' },
  { name: 'Ana P.', text: 'Roteiro de downwind mais lindo que já fiz. Equipe top!', avatar: '🏄' },
]

export default function CartCheckout() {
  const { t } = useLanguage()
  const { theme } = useTheme()
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
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [successIds, setSuccessIds] = useState<string[]>([])
  const [checkoutWhatsApp, setCheckoutWhatsApp] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')

  // Card form
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardInstallments, setCardInstallments] = useState('1')

  // PIX
  const [pixCopied, setPixCopied] = useState(false)
  const [pixKey] = useState('amzwind@amazonwind.com.br')

  const { profile, saveWhatsApp } = useProfile()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionUserId(session.user.id)
        setSessionEmail(session.user.email || null)
      }
    })
  }, [])

  useEffect(() => {
    if (profile?.whatsapp) {
      setCheckoutWhatsApp(profile.whatsapp)
    }
  }, [profile])

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
    if (!checkoutWhatsApp.trim() && !profile?.whatsapp) {
      setToast({ message: 'Informe seu WhatsApp para contato.', type: 'error' })
      return
    }
    if (!sessionUserId) {
      setShowAuthModal(true)
      return
    }
    handlePaymentConfirm()
  }

  async function handlePaymentConfirm() {
    setPaymentProcessing(true)

    const userId = sessionUserId
    const bookingDate = items[0]?.booking_date || new Date().toISOString().slice(0, 10)

    const whatsappValue = checkoutWhatsApp.trim() || profile?.whatsapp || ''

    if (whatsappValue && profile) {
      await saveWhatsApp(whatsappValue)
    }

    const notes = JSON.stringify({
      items: items.map((i) => ({ id: i.id, type: i.type, title: i.title, price: i.price, quantity: i.quantity, booking_date: i.booking_date })),
      contact_whatsapp: whatsappValue,
      payment_confirmed: true,
      payment_method: paymentMethod,
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

  function copyPixKey() {
    navigator.clipboard.writeText(pixKey)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 3000)
  }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19)
  }

  function formatExpiry(v: string) {
    return v.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5)
  }

  const subtotal = getSubtotal()
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0
  const finalTotal = subtotal - pixDiscount

  if (successIds.length > 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amz-dourado flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{t.checkoutSuccess}</h1>
        <p className="text-sm text-gray-500 dark:text-white/50 mb-2 max-w-md">{t.checkoutSuccessDetail}</p>
        {successIds.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-white/30 mb-6 font-mono bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
            #{successIds.slice(0, 3).join(' · #')}
          </p>
        )}
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">{t.navHome}</button>
          <button onClick={() => navigate('/minha-conta')} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors shadow-lg shadow-amz-dourado/25">{t.cartMyBookings}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white dark:bg-[#1a0f08] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/[0.06] w-full max-w-md p-6 sm:p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amz-dourado/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.checkoutLoginTitle}</h2>
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
                className="w-full py-2.5 rounded-xl bg-amz-dourado text-white font-bold text-sm hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amz-dourado/20">
                {authLoading ? '...' : authMode === 'login' ? t.checkoutLoginButton : 'Criar conta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Brand Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amz-terra via-amz-terra-dark to-[#0a1a2f] dark:from-[#0d1f35] dark:via-[#0a1525] dark:to-[#060e1a] p-6 sm:p-8">
        {/* Wave pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1200,200 L0,200 Z" fill="currentColor" className="text-white" />
            <path d="M0,130 C200,180 400,80 600,130 C800,180 1000,80 1200,130 L1200,200 L0,200 Z" fill="currentColor" className="text-white" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <img
            src={theme === 'dark' ? '/logo-horizontal-branca.svg' : '/logo-horizontal-branca.svg'}
            alt="Amazon Wind"
            className="h-10 sm:h-12"
          />
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="text-xs font-semibold text-white/90">100% Seguro</span>
          </div>
        </div>
        <div className="relative z-10 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t.cartTitle}</h1>
          <p className="text-sm text-white/60 mt-1">
            {sessionUserId ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {t.checkoutLoggedInAs} {sessionEmail}
              </span>
            ) : items.length > 0 ? `${items.length} ${t.cartItemCount}` : t.cartEmpty}
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔒', label: 'Pagamento Criptografado', sub: 'SSL/TLS' },
          { icon: '🛡️', label: 'Garantia Amazon Wind', sub: 'Até 30 dias' },
          { icon: '💬', label: 'Suporte via WhatsApp', sub: 'Resposta rápida' },
        ].map((badge) => (
          <div key={badge.label} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-3 text-center">
            <div className="text-2xl mb-1">{badge.icon}</div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-white/70 leading-tight">{badge.label}</p>
            <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-white/30 mt-0.5">{badge.sub}</p>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/[0.06]">
          <div className="w-20 h-20 rounded-full bg-amz-dourado/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t.cartEmpty}</h2>
          <p className="text-sm text-gray-400 dark:text-white/30 mb-6 max-w-sm mx-auto">
            Explore nossas experiências, produtos e aulas e adicione itens ao carrinho para reservar.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/experiencias" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amz-dourado text-white hover:bg-amber-700 transition-colors shadow-lg shadow-amz-dourado/20">
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
                className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 flex gap-4 items-center hover:shadow-lg hover:shadow-amz-dourado/5 transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <Link to={getItemLink(item)} className="flex-shrink-0 relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amz-dourado/10 to-amz-dourado/5 flex items-center justify-center text-2xl">
                      {item.type === 'experience' ? '🧭' : item.type === 'product' ? '📦' : '🪁'}
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amz-dourado flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
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
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <svg className="w-3.5 h-3.5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-xs text-amz-dourado font-medium">
                        {new Date(item.booking_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm font-bold text-amz-dourado">
                      {formatBRL(item.price)}
                    </p>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 hover:bg-white dark:hover:bg-white/10 rounded-md text-sm font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold text-gray-900 dark:text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 hover:bg-white dark:hover:bg-white/10 rounded-md text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => { removeItem(item.id, item.type); setToast({ message: 'Item removido do carrinho', type: 'success' }) }}
                  className="flex-shrink-0 p-2 rounded-xl text-gray-300 dark:text-white/20 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar: Payment & Summary */}
          <div className="space-y-4">
            {/* Receipt Summary */}
            <div className="bg-white dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/[0.06] overflow-hidden sticky top-24">
              {/* Receipt Header */}
              <div className="bg-gradient-to-r from-amz-dourado to-amber-600 px-5 py-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resumo da Reserva</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Items */}
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-white/40 truncate max-w-[180px]">
                        {item.title} {item.quantity > 1 ? `x${item.quantity}` : ''}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatBRL(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-white/30">Subtotal</span>
                    <span className="text-gray-600 dark:text-white/50">{formatBRL(subtotal)}</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Desconto PIX (5%)
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">-{formatBRL(pixDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-amz-dourado text-lg">{formatBRL(finalTotal)}</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white/60 mb-1.5">
                    WhatsApp para contato {!profile?.whatsapp && <span className="text-red-500">*</span>}
                    {profile?.whatsapp && <span className="text-emerald-500 text-[10px] ml-1">(preenchido)</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <input
                      type="tel"
                      required={!profile?.whatsapp}
                      value={checkoutWhatsApp}
                      onChange={(e) => setCheckoutWhatsApp(e.target.value)}
                      placeholder={profile?.whatsapp || "(00) 00000-0000"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white/60 mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'pix' as const, icon: '⚡', label: 'PIX', sub: '5% off' },
                      { key: 'card' as const, icon: '💳', label: 'Cartão', sub: 'Até 6x' },
                      { key: 'paypal' as const, icon: '🅿️', label: 'PayPal', sub: 'Internacional' },
                    ]).map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setPaymentMethod(m.key)}
                        className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                          paymentMethod === m.key
                            ? 'border-amz-dourado bg-amz-dourado/5 shadow-md shadow-amz-dourado/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        {paymentMethod === m.key && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amz-dourado flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                        <div className="text-xl mb-0.5">{m.icon}</div>
                        <p className="text-[10px] font-bold text-gray-900 dark:text-white">{m.label}</p>
                        <p className="text-[9px] text-gray-400 dark:text-white/30">{m.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIX Details */}
                {paymentMethod === 'pix' && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⚡</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Aprovação Instantânea</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">5% de desconto aplicado</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-black/20 rounded-xl p-3 mb-2">
                      <p className="text-[10px] text-gray-400 dark:text-white/30 mb-1">Chave PIX (Copia e Cola):</p>
                      <p className="text-xs font-mono text-gray-700 dark:text-white/70 break-all">{pixKey}</p>
                    </div>
                    <button onClick={copyPixKey} className="w-full py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">
                      {pixCopied ? '✓ Copiado!' : 'Copiar Chave PIX'}
                    </button>
                  </div>
                )}

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-4 border border-gray-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-1">
                        <div className="w-8 h-5 rounded bg-[#1A1F71] flex items-center justify-center"><span className="text-white text-[7px] font-bold">VISA</span></div>
                        <div className="w-8 h-5 rounded bg-[#EB001B] flex items-center justify-center"><span className="text-white text-[7px] font-bold">MC</span></div>
                        <div className="w-8 h-5 rounded bg-[#006FCF] flex items-center justify-center"><span className="text-white text-[7px] font-bold">ELO</span></div>
                      </div>
                      <div className="flex-1" />
                      <svg className="w-4 h-4 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Nome no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 dark:text-white/40 mb-1">Parcelamento</label>
                      <select
                        value={cardInstallments}
                        onChange={(e) => setCardInstallments(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amz-dourado/50 focus:border-amz-dourado transition-colors"
                      >
                        <option value="1">1x {formatBRL(finalTotal)} (sem juros)</option>
                        <option value="2">2x {formatBRL(finalTotal / 2)} (sem juros)</option>
                        <option value="3">3x {formatBRL(finalTotal / 3)} (sem juros)</option>
                        <option value="6">6x {formatBRL(finalTotal / 6)} (sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-[#003087]/5 dark:bg-[#003087]/10 rounded-2xl p-4 border border-[#003087]/20 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#003087] flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-lg">PP</span>
                    </div>
                    <p className="text-xs font-semibold text-[#003087] dark:text-[#0070ba] mb-1">PayPal Checkout</p>
                    <p className="text-[10px] text-gray-500 dark:text-white/30">Você será redirecionado para o PayPal para concluir o pagamento de forma segura.</p>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={paymentProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amz-dourado to-amber-500 text-white font-bold text-sm hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amz-dourado/25 hover:shadow-xl hover:shadow-amz-dourado/30 active:scale-[0.98]"
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
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Confirmar Pagamento — {formatBRL(finalTotal)}
                    </span>
                  )}
                </button>

                <button onClick={() => navigate(-1)} className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors">
                  ← {t.adminBack}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">O que nossos clientes dizem</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {testimonials.map((test) => (
              <div key={test.name} className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-4 border border-gray-100 dark:border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amz-dourado/10 flex items-center justify-center text-sm">{test.avatar}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{test.name}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className="text-[10px] text-amz-dourado">★</span>)}</div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-white/40 leading-relaxed">"{test.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Support Banner */}
      {items.length > 0 && (
        <a
          href="https://wa.me/5584999999999?text=Olá! Tenho uma dúvida sobre minha reserva na Amazon Wind."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-[#25D366]/10 dark:bg-[#25D366]/5 rounded-2xl p-4 border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#25D366] dark:text-[#25D366]">Dúvidas? Fale conosco</p>
            <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Suporte via WhatsApp • Resposta em minutos</p>
          </div>
          <svg className="w-5 h-5 text-[#25D366] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </a>
      )}
    </div>
  )
}
