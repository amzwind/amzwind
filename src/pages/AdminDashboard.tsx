import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { ExperiencesManager } from '../components/admin/ExperiencesManager'
import { ProductsManager } from '../components/admin/ProductsManager'
import { ClassesManager } from '../components/admin/ClassesManager'
import { BookingsManager } from '../components/admin/BookingsManager'

type AdminTab = 'dashboard' | 'experiences' | 'products' | 'classes' | 'bookings' | 'cart'

export function AdminDashboard() {
  const navigate = useNavigate()
  useLanguage()
  useTheme()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  const [stats, setStats] = useState({
    experiencesCount: 0,
    productsCount: 0,
    classesCount: 0,
    bookingsCount: 0
  })

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
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || profile?.role !== 'admin') {
        alert('Acesso restrito a administradores.')
        navigate('/')
        return
      }

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
        supabase.from('bookings').select('id', { count: 'exact', head: true })
      ])

      setStats({
        experiencesCount: expRes.count || 0,
        productsCount: prodRes.count || 0,
        classesCount: classRes.count || 0,
        bookingsCount: bookRes.count || 0
      })
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

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
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark text-amz-terra-dark dark:text-amz-areia pb-20">
      {/* Header Admin */}
      <header className="bg-white dark:bg-amz-terra/40 shadow-sm border-b border-amber-900/10 px-6 py-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-md">
        <div>
          <h1 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia">Amazon Wind — Gestão</h1>
          <p className="text-xs uppercase tracking-widest text-amz-terra-light dark:text-amz-areia/60">Painel Operacional</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-amz-terra/30 dark:border-amz-areia/30 hover:bg-amz-terra hover:text-white transition cursor-pointer flex items-center gap-2"
        >
          ← Voltar ao Site
        </button>
      </header>

      {/* Navegação por Abas */}
      <div className="max-w-7xl mx-auto px-6 mt-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-amber-900/10 pb-4 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'dashboard' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'experiences' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Experiências
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'products' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'classes' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Aulas
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'bookings' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Reservas
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${activeTab === 'cart' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
          >
            Carrinho / Checkout
          </button>
        </div>
      </div>

      {/* Conteúdo da Aba */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <h3 className="text-xs uppercase text-amz-terra-light dark:text-amz-areia/60 font-semibold">Experiências</h3>
                <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{stats.experiencesCount}</p>
              </div>
              <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <h3 className="text-xs uppercase text-amz-terra-light dark:text-amz-areia/60 font-semibold">Produtos</h3>
                <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{stats.productsCount}</p>
              </div>
              <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <h3 className="text-xs uppercase text-amz-terra-light dark:text-amz-areia/60 font-semibold">Aulas</h3>
                <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{stats.classesCount}</p>
              </div>
              <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <h3 className="text-xs uppercase text-amz-terra-light dark:text-amz-areia/60 font-semibold">Reservas</h3>
                <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{stats.bookingsCount}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experiences' && <ExperiencesManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'classes' && <ClassesManager />}
        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'cart' && (
          <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl border border-amber-900/10 text-center py-12">
            <h3 className="font-maybug text-xl mb-2">Módulo de Carrinho Administrativo</h3>
            <p className="text-xs opacity-70">Utilize esta área para conferência de simulação de preços e motor de checkout.</p>
          </div>
        )}
      </main>
    </div>
  )
}