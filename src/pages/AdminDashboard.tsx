import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import ExperiencesManager from '../components/admin/ExperiencesManager'
import ProductsManager from '../components/admin/ProductsManager'
import ClassesManager from '../components/admin/ClassesManager'
import BookingsManager from '../components/admin/BookingsManager'
import CartCheckout from '../components/CartCheckout'
import MetricCard, { StatusBadge, Toast, ModalShell, FormField, Input, Select, Textarea, PrimaryButton, GhostButton } from '../components/admin/SharedUI'

type Experience = Tables<'experiences'>
type Booking = Tables<'bookings'>
type Product = Tables<'products'>

type AdminTab = 'dashboard' | 'experiences' | 'products' | 'classes' | 'bookings' | 'cart' | 'manual' | 'calendar'

const NAV_ITEMS: { key: AdminTab; icon: string }[] = [
  { key: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { key: 'experiences', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { key: 'products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'classes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'manual', icon: 'M12 4v16m8-8H4' },
  { key: 'calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
]

export function AdminDashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Manual booking state
  const [showManual, setShowManual] = useState(false)
  const [manualForm, setManualForm] = useState({ client_name: '', client_email: '', client_phone: '', item_type: 'experience' as 'experience' | 'class' | 'product', item_id: '', booking_date: '', notes: '' })
  const [manualItems, setManualItems] = useState<{ id: string; title: string }[]>([])
  const [manualLoading, setManualLoading] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login', { replace: true }); return }
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (!data || data.role !== 'admin') { await supabase.auth.signOut(); navigate('/login', { replace: true }); return }
      setIsAdmin(true)
      setLoading(false)
    }
    checkAdmin()
  }, [navigate])

  useEffect(() => {
    if (!isAdmin) return
    async function load() {
      const [eRes, bRes, pRes] = await Promise.all([
        supabase.from('experiences').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ])
      if (eRes.data) setExperiences(eRes.data)
      if (bRes.data) setBookings(bRes.data)
      if (pRes.data) setProducts(pRes.data)
    }
    load()
  }, [isAdmin])

  useEffect(() => {
    if (activeTab === 'manual') {
      const tableName = manualForm.item_type === 'experience' ? 'experiences' : manualForm.item_type === 'class' ? 'experiences' : 'products'
      supabase.from(tableName).select('id, title').order('title').then(({ data }) => {
        if (data) setManualItems(data)
      })
    }
  }, [activeTab, manualForm.item_type])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }, [navigate])

  async function handleManualBooking(e: React.FormEvent) {
    e.preventDefault()
    setManualLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const { error } = await supabase.from('bookings').insert({
      user_id: session?.user.id || '00000000-0000-0000-0000-000000000000',
      item_type: manualForm.item_type,
      item_id: manualForm.item_id,
      status: 'confirmed',
      booking_date: manualForm.booking_date || new Date().toISOString(),
      notes: `[MANUAL] ${manualForm.client_name} | ${manualForm.client_email} | ${manualForm.client_phone} | ${manualForm.notes}`,
    })
    if (error) setToast({ message: error.message, type: 'error' })
    else {
      setToast({ message: t.adminManualBookingCreated, type: 'success' })
      setShowManual(false)
      setManualForm({ client_name: '', client_email: '', client_phone: '', item_type: 'experience', item_id: '', booking_date: '', notes: '' })
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
      if (data) setBookings(data)
    }
    setManualLoading(false)
  }

  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const revenue = bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => {
    const exp = experiences.find((e) => e.id === b.item_id)
    const prod = products.find((p) => p.id === b.item_id)
    return s + (exp?.price || prod?.price || 0)
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0604] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 dark:text-white/40 font-medium">Amazon Wind Admin</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  const navLabel: Record<AdminTab, string> = {
    dashboard: t.adminDashboard,
    experiences: t.adminExperiences,
    products: t.adminProducts,
    classes: t.adminClasses,
    bookings: t.adminBookings,
    cart: t.cartTitle,
    manual: t.adminManualBooking,
    calendar: t.adminCalendar,
  }

  // Calendar logic
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const bookingsByDate: Record<string, number> = {}
  bookings.forEach((b) => {
    const d = new Date(b.booking_date).toLocaleDateString('pt-BR')
    bookingsByDate[d] = (bookingsByDate[d] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0604] flex transition-colors duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ═══ SIDEBAR (Desktop) ═══ */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#110b06] border-r border-gray-200 dark:border-white/[0.06]">
        <div className="px-5 py-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amz-dourado flex items-center justify-center">
              <span className="text-white font-bold text-sm">AW</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">Amazon Wind</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.key
                  ? 'bg-amz-dourado/10 text-amz-dourado'
                  : 'text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:text-gray-900 dark:hover:text-white/60'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {navLabel[item.key]}
              {item.key === 'bookings' && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{pendingCount}</span>
              )}
              {item.key === 'cart' && (
                <span className="ml-auto bg-amz-dourado text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">+</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 dark:border-white/[0.06] space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {theme === 'dark'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />}
            </svg>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {t.adminLogout}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-[#0a0604]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
            <svg className="w-5 h-5 text-gray-700 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">{navLabel[activeTab]}</h1>
          <button onClick={toggleTheme} className="p-2 -mr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5">
            {theme === 'dark'
              ? <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              : <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white dark:bg-[#110b06] shadow-2xl">
              <div className="px-5 py-5 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amz-dourado flex items-center justify-center"><span className="text-white font-bold text-sm">AW</span></div>
                  <div><h1 className="text-sm font-bold text-gray-900 dark:text-white">Amazon Wind</h1><p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">Admin</p></div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.key ? 'bg-amz-dourado/10 text-amz-dourado' : 'text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                    {navLabel[item.key]}
                  </button>
                ))}
              </nav>
              <div className="px-3 py-4 border-t border-gray-100 dark:border-white/[0.06] space-y-1">
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  {t.adminLogout}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.adminOverview}</h1>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{t.adminQuickActions}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label={t.adminTotalExperiences} value={experiences.length} color="text-amz-dourado" icon={<svg className="w-5 h-5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} />
                <MetricCard label={t.adminTotalProducts} value={products.length} color="text-amz-oceano" icon={<svg className="w-5 h-5 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
                <MetricCard label={t.adminTotalBookings} value={bookings.length} color="text-amz-bio" icon={<svg className="w-5 h-5 text-amz-bio" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <MetricCard label={t.adminRevenue} value={`R$ ${revenue.toLocaleString('pt-BR')}`} color="text-emerald-600" icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              </div>

              <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t.adminRecentBookings}</h3>
                </div>
                {bookings.length === 0 ? (
                  <p className="p-8 text-center text-sm text-gray-400 dark:text-white/30">{t.adminNoBookings}</p>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                    {bookings.slice(0, 8).map((b) => (
                      <div key={b.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amz-dourado/10 flex items-center justify-center text-sm">
                            {b.item_type === 'experience' ? '🌊' : b.item_type === 'class' ? '🎓' : '📦'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{b.item_type === 'experience' ? 'Experiência' : b.item_type === 'class' ? 'Aula' : 'Produto'}</p>
                            <p className="text-xs text-gray-400 dark:text-white/30">{new Date(b.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experiences' && <ExperiencesManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'classes' && <ClassesManager />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'cart' && <CartCheckout />}

          {/* Manual Booking */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminManualBooking}</h2>
                  <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{t.adminManualBookingTitle}</p>
                </div>
                <PrimaryButton onClick={() => setShowManual(true)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  {t.adminManualBookingCreate}
                </PrimaryButton>
              </div>

              {showManual && (
                <ModalShell onClose={() => setShowManual(false)} title={t.adminManualBookingTitle}>
                  <form onSubmit={handleManualBooking} className="space-y-4">
                    <FormField label={t.adminManualBookingClient}><Input required value={manualForm.client_name} onChange={(e) => setManualForm({ ...manualForm, client_name: e.target.value })} /></FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label={t.adminManualBookingEmail}><Input type="email" required value={manualForm.client_email} onChange={(e) => setManualForm({ ...manualForm, client_email: e.target.value })} /></FormField>
                      <FormField label={t.adminManualBookingPhone}><Input value={manualForm.client_phone} onChange={(e) => setManualForm({ ...manualForm, client_phone: e.target.value })} /></FormField>
                    </div>
                    <FormField label={t.adminManualBookingItem}>
                      <Select value={manualForm.item_type} onChange={(e) => setManualForm({ ...manualForm, item_type: e.target.value as 'experience' | 'class' | 'product', item_id: '' })}>
                        <option value="experience">{t.adminExperiences}</option>
                        <option value="class">{t.adminClasses}</option>
                        <option value="product">{t.adminProducts}</option>
                      </Select>
                    </FormField>
                    <FormField label={t.adminManualBookingItem}>
                      <Select required value={manualForm.item_id} onChange={(e) => setManualForm({ ...manualForm, item_id: e.target.value })}>
                        <option value="">{t.adminExpFormSelectCategory}</option>
                        {manualItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                      </Select>
                    </FormField>
                    <FormField label={t.adminManualBookingDate}><Input type="date" value={manualForm.booking_date} onChange={(e) => setManualForm({ ...manualForm, booking_date: e.target.value })} /></FormField>
                    <FormField label={t.adminManualBookingNotes}><Textarea rows={2} value={manualForm.notes} onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })} /></FormField>
                    <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                      <GhostButton type="button" onClick={() => setShowManual(false)} className="flex-1">{t.adminCancel}</GhostButton>
                      <PrimaryButton type="submit" disabled={manualLoading} className="flex-1">{manualLoading ? '...' : t.adminManualBookingCreate}</PrimaryButton>
                    </div>
                  </form>
                </ModalShell>
              )}
            </div>
          )}

          {/* Operations Calendar */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.adminCalendarTitle}</h2>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{monthNames[currentMonth]} {currentYear}</p>
              </div>

              <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                    <div key={d} className="text-center text-[11px] font-semibold text-gray-400 dark:text-white/30 py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />
                    const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString('pt-BR')
                    const count = bookingsByDate[dateStr] || 0
                    const isToday = day === today.getDate()
                    return (
                      <div key={day} className={`relative p-2 rounded-xl text-center text-sm min-h-[48px] transition-colors ${
                        isToday ? 'bg-amz-dourado/10 ring-2 ring-amz-dourado/30' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                      }`}>
                        <span className={`text-xs font-semibold ${isToday ? 'text-amz-dourado' : 'text-gray-700 dark:text-white/60'}`}>{day}</span>
                        {count > 0 && (
                          <div className="mt-1">
                            <span className="inline-block w-5 h-5 rounded-full bg-amz-dourado text-white text-[10px] font-bold leading-5">{count}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Upcoming bookings */}
              <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t.adminRecentBookings}</h3>
                </div>
                {bookings.filter((b) => new Date(b.booking_date) >= today).length === 0 ? (
                  <p className="p-8 text-center text-sm text-gray-400 dark:text-white/30">{t.adminNoBookings}</p>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                    {bookings.filter((b) => new Date(b.booking_date) >= today).slice(0, 10).map((b) => (
                      <div key={b.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amz-dourado/10 flex items-center justify-center text-sm">
                            {b.item_type === 'experience' ? '🌊' : b.item_type === 'class' ? '🎓' : '📦'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{b.notes?.split('|')[0]?.replace('[MANUAL]', '').trim() || b.item_type}</p>
                            <p className="text-xs text-gray-400 dark:text-white/30">{new Date(b.booking_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
