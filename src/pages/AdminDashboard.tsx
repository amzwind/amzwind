import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'experiences' | 'bookings'>('stats')

  // Estados para dados
  const [experiences, setExperiences] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Formulário para nova experiência
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [community, setCommunity] = useState('')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Se não estiver logado, redireciona para a home ou login
        navigate('/')
        return
      }

      // Verifica se o usuário é admin na tabela profiles
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
      loadDashboardData()
    } catch (err) {
      console.error('Erro ao verificar permissões:', err)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Carrega experiências
      const { data: expData } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })

      if (expData) setExperiences(expData)

      // Carrega reservas
      const { data: bookData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (bookData) setBookings(bookData)
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err)
    }
  }

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Pega a primeira categoria disponível para associar provisoriamente
      const { data: cats } = await supabase.from('categories').select('id').limit(1)
      const categoryId = cats && cats.length > 0 ? cats[0].id : null

      if (!categoryId) {
        alert('Cadastre uma categoria no banco antes de criar experiências.')
        return
      }

      const { error } = await supabase.from('experiences').insert({
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        price: parseFloat(price) || 0,
        description,
        community,
        category_id: categoryId,
        featured: true
      })

      if (error) throw error

      alert('Experiência criada com sucesso!')
      setIsModalOpen(false)
      setTitle('')
      setSlug('')
      setPrice('')
      setDescription('')
      setCommunity('')
      loadDashboardData()
    } catch (err: any) {
      alert('Erro ao criar experiência: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-2xl animate-pulse">
          Carregando Painel Amazon Wind...
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark text-amz-terra-dark dark:text-amz-areia pb-20">
      {/* Header do Admin */}
      <header className="bg-white dark:bg-amz-terra/40 shadow-sm border-b border-amber-900/10 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-maybug text-2xl text-amz-terra dark:text-amz-areia">Amazon Wind — Admin</h1>
          <p className="text-xs uppercase tracking-widest text-amz-terra-light dark:text-amz-areia/60">Painel de Gestão Operacional</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-amz-terra/30 dark:border-amz-areia/30 hover:bg-amz-terra hover:text-white transition"
        >
          Voltar ao Site
        </button>
      </header>

      {/* Navegação por Abas */}
      <div className="max-w-6xl mx-auto px-6 mt-6 flex gap-4 border-b border-amber-900/10 pb-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'stats' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'experiences' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Experiências & Downwinds ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'bookings' ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark' : 'bg-white/50 dark:bg-white/5 hover:bg-white'}`}
        >
          Reservas ({bookings.length})
        </button>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Total de Experiências</h3>
              <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{experiences.length}</p>
            </div>
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Reservas Registradas</h3>
              <p className="text-4xl font-maybug mt-2 text-amz-terra dark:text-amz-areia">{bookings.length}</p>
            </div>
            <div className="bg-white dark:bg-amz-terra/30 p-6 rounded-2xl shadow-sm border border-amber-900/10">
              <h3 className="text-sm uppercase text-amz-terra-light dark:text-amz-areia/60">Status do Banco</h3>
              <p className="text-lg font-semibold mt-2 text-emerald-600 dark:text-emerald-400">● Conectado (Supabase)</p>
            </div>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-maybug">Gerenciar Roteiros e Downwinds</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary text-sm py-2 px-4"
              >
                + Nova Experiência
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white dark:bg-amz-terra/30 p-5 rounded-xl border border-amber-900/10 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.title}</h3>
                    <p className="text-sm text-amz-terra-light dark:text-amz-areia/70 mt-1">Comunidade: {exp.community || 'Geral'}</p>
                    <p className="text-sm font-semibold text-amz-terra dark:text-amz-dourado mt-2">R$ {exp.price}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/55 text-amz-terra dark:text-amz-areia font-medium">
                    Ativo
                  </span>
                </div>
              ))}
              {experiences.length === 0 && (
                <p className="text-amz-terra-light dark:text-amz-areia/60 italic">Nenhuma experiência cadastrada ainda.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-maybug mb-6">Gerenciamento de Reservas</h2>
            {bookings.length === 0 ? (
              <p className="text-amz-terra-light dark:text-amz-areia/60 italic">Nenhuma reserva registrada no momento.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-amz-terra/30 p-4 rounded-xl border border-amber-900/10 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">Tipo: {booking.item_type}</p>
                      <p className="text-xs text-amz-terra-light dark:text-amz-areia/60">Data: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold uppercase">
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#3D1D0F] max-w-lg w-full p-6 rounded-2xl shadow-xl border border-amber-900/20">
            <h3 className="font-maybug text-xl mb-4">Adicionar Nova Experiência</h3>
            <form onSubmit={handleCreateExperience} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Título do Downwind / Roteiro</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Ex: Ajuruteua > Salinas"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Preço (R$)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="450.00"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Comunidade / Local Base</label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Ex: Salinópolis - PA"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                  placeholder="Detalhes da expedição..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-amber-900/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary text-sm py-2 px-6"
                >
                  Salvar Roteiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}