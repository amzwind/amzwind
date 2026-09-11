import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { HeroManager } from '../components/admin/HeroManager'
import { ExperiencesManager } from '../components/admin/ExperiencesManager'
import { ProductsManager } from '../components/admin/ProductsManager'
import { ClassesManager } from '../components/admin/ClassesManager'
import { BookingsManager } from '../components/admin/BookingsManager'
import { FinancialManager } from '../components/admin/FinancialManager'
import { AboutManager } from '../components/admin/AboutManager'
import MetricCard from '../components/admin/SharedUI'

type AdminTab = 'dashboard' | 'hero' | 'experiences' | 'products' | 'classes' | 'bookings' | 'financial' | 'about'

interface SidebarItem {
  key: AdminTab
  label: string
  icon: JSX.Element
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [stats, setStats] = useState({
    experiencesCount: 0,
    productsCount: 0,
    classesCount: 0,
    bookingsCount: 0,
  })
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (error || profile?.role !== 'admin') {
        alert('Acesso restrito a administradores.')
        navigate('/')
        return
      }

      setProfile({ full_name: profile.full_name, avatar_url: profile.avatar_url })
      setIsAdmin(true)
      loadStats()
    } catch (err) {
      console.error('Erro de permissão:', err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const [expRes, prodRes, classRes, bookRes] = await Promise.all([
        supabase.from('experiences').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        experiencesCount: expRes.count || 0,
        productsCount: prodRes.count || 0,
        classesCount: classRes.count || 0,
        bookingsCount: bookRes.count || 0,
      })
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

  const sidebarItems: SidebarItem[] = [
    {
      key: 'dashboard',
      label: t.adminOverview || 'Visão Geral',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'hero',
      label: 'Hero / Capa',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'experiences',
      label: t.adminExperiences || 'Experiências',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'products',
      label: t.adminProducts || 'Produtos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: 'classes',
      label: t.adminClasses || 'Aulas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      key: 'bookings',
      label: t.adminBookings || 'Reservas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'financial',
      label: t.adminFinancial || 'Financeiro',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'about',
      label: t.adminAbout || 'Sobre',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-xl animate-pulse">
          Carregando Painel Administrativo...
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a06] text-gray-900 dark:text-white flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white dark:bg-[#1a0f08] border-r border-gray-200 dark:border-white/[0.06] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amz-dourado flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">AW</span>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h2 className="font-maybug text-sm text-gray-900 dark:text-white truncate">Amazon Wind</h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">Painel Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.key
                  ? 'bg-amz-dourado/10 text-amz-dourado dark:bg-amz-dourado/15 dark:text-amz-dourado'
                  : 'text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white/70'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className={`shrink-0 ${activeTab === item.key ? 'text-amz-dourado' : 'text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/50'}`}>
                {item.icon}
              </span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {activeTab === item.key && sidebarOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amz-dourado" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-gray-200 dark:border-white/[0.06] space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
            title={!sidebarOpen ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : undefined}
          >
            <span className="shrink-0">
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </span>
            {sidebarOpen && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
            title={!sidebarOpen ? t.adminBackToSite : undefined}
          >
            <span className="shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            {sidebarOpen && <span>{t.adminBackToSite || 'Voltar ao Site'}</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            <span className="shrink-0">
              <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </span>
            {sidebarOpen && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-[#1a0f08] shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amz-dourado flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AW</span>
                </div>
                <div>
                  <h2 className="font-maybug text-sm text-gray-900 dark:text-white">Amazon Wind</h2>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">Painel Admin</p>
                </div>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setMobileSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.key
                      ? 'bg-amz-dourado/10 text-amz-dourado'
                      : 'text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={activeTab === item.key ? 'text-amz-dourado' : 'text-gray-400 dark:text-white/30'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-200 dark:border-white/[0.06] space-y-1">
              <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04]">
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
              </button>
              <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/[0.04]">
                <span>←</span>
                <span>{t.adminBackToSite || 'Voltar ao Site'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white/80 dark:bg-[#1a0f08]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
              {sidebarItems.find((i) => i.key === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 dark:text-white/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.adminConnected || 'Online'}
            </div>
            {profile && (
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-white/[0.06]">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Admin'}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-white/[0.1]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amz-dourado/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-amz-dourado">
                      {(profile.full_name || 'A').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden md:block text-xs font-medium text-gray-700 dark:text-white/60 max-w-[120px] truncate">
                  {profile.full_name || 'Admin'}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <MetricCard
                  label={t.adminTotalExperiences || 'Experiências'}
                  value={stats.experiencesCount}
                  color="text-amz-oceano"
                  onClick={() => setActiveTab('experiences')}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />
                <MetricCard
                  label={t.adminTotalProducts || 'Produtos'}
                  value={stats.productsCount}
                  color="text-amz-dourado"
                  onClick={() => setActiveTab('products')}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  }
                />
                <MetricCard
                  label={t.adminTotalBookings || 'Reservas'}
                  value={stats.bookingsCount}
                  color="text-amz-bio"
                  onClick={() => setActiveTab('bookings')}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <MetricCard
                  label={t.adminClasses || 'Aulas'}
                  value={stats.classesCount}
                  color="text-amz-terra-light"
                  onClick={() => setActiveTab('classes')}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'hero' && <HeroManager />}
          {activeTab === 'experiences' && <ExperiencesManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'classes' && <ClassesManager />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'financial' && <FinancialManager />}
          {activeTab === 'about' && <AboutManager />}
        </main>
      </div>
    </div>
  )
}
