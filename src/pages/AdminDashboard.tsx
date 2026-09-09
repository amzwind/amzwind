import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'

type Experience = Tables<'experiences'>
type Category = Tables<'categories'>
type Booking = Tables<'bookings'>

type Tab = 'dashboard' | 'experiences' | 'bookings'

// Slugify: converte título em slug URL-friendly
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Formato de moeda brasileira
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Status badge colors
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

// Ícone por tab
function TabIcon({ tab, active }: { tab: Tab; active: boolean }) {
  const cls = active ? 'text-amz-dourado' : 'text-amz-terra-light'
  if (tab === 'dashboard') {
    return (
      <svg className={`w-5 h-5 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  }
  if (tab === 'experiences') {
    return (
      <svg className={`w-5 h-5 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  }
  return (
    <svg className={`w-5 h-5 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Auth state
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  // Data
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    duration: '',
    level: '',
    community: '',
    image_url: '',
    video_url: '',
    featured: false,
  })

  // -------------------------------------------------------
  // Auth check
  // -------------------------------------------------------
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!data || data.role !== 'admin') {
        navigate('/')
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    checkAdmin()
  }, [navigate])

  // -------------------------------------------------------
  // Load data
  // -------------------------------------------------------
  useEffect(() => {
    if (!isAdmin) return
    loadData()
  }, [isAdmin])

  async function loadData() {
    const [expRes, catRes, bookRes] = await Promise.all([
      supabase.from('experiences').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ])

    if (expRes.data) setExperiences(expRes.data)
    if (catRes.data) setCategories(catRes.data)
    if (bookRes.data) {
      setBookings(bookRes.data)
      setPendingCount(bookRes.data.filter(b => b.status === 'pending').length)
    }
  }

  // -------------------------------------------------------
  // Open modal for create/edit
  // -------------------------------------------------------
  function openCreateModal() {
    setEditingExperience(null)
    setForm({
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      price: '',
      duration: '',
      level: '',
      community: '',
      image_url: '',
      video_url: '',
      featured: false,
    })
    setShowModal(true)
  }

  function openEditModal(exp: Experience) {
    setEditingExperience(exp)
    setForm({
      title: exp.title,
      description: exp.description || '',
      category_id: exp.category_id,
      price: String(exp.price),
      duration: exp.duration || '',
      level: exp.level || '',
      community: exp.community || '',
      image_url: exp.image_url || '',
      video_url: exp.video_url || '',
      featured: exp.featured,
    })
    setShowModal(true)
  }

  // -------------------------------------------------------
  // Submit form (create or update)
  // -------------------------------------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormLoading(true)

    const payload = {
      title: form.title,
      slug: slugify(form.title),
      description: form.description || null,
      category_id: form.category_id,
      price: Number(form.price) || 0,
      duration: form.duration || null,
      level: form.level || null,
      community: form.community || null,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      featured: form.featured,
    }

    let error
    if (editingExperience) {
      const res = await supabase
        .from('experiences')
        .update(payload)
        .eq('id', editingExperience.id)
      error = res.error
    } else {
      const res = await supabase.from('experiences').insert(payload)
      error = res.error
    }

    if (error) {
      alert(`Erro: ${error.message}`)
    } else {
      setShowModal(false)
      await loadData()
    }

    setFormLoading(false)
  }

  // -------------------------------------------------------
  // Delete experience
  // -------------------------------------------------------
  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return

    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) {
      alert(`Erro: ${error.message}`)
    } else {
      await loadData()
    }
  }

  // -------------------------------------------------------
  // Update booking status
  // -------------------------------------------------------
  async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert(`Erro: ${error.message}`)
    } else {
      await loadData()
    }
  }

  // -------------------------------------------------------
  // Sign out
  // -------------------------------------------------------
  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  // -------------------------------------------------------
  // Loading / unauthorized
  // -------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amz-areia">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-amz-terra-light text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-amz-areia pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-amz-terra text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-maybug text-lg">Amazon Wind</h1>
            <p className="text-white/60 text-xs">Painel Administrativo</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-white/70 hover:text-white text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pt-4">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="font-maybug text-xl text-amz-terra">Visão Geral</h2>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-amz-terra-light uppercase tracking-wide">Experiências</p>
                <p className="text-2xl font-bold text-amz-terra mt-1">{experiences.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-amz-terra-light uppercase tracking-wide">Reservas</p>
                <p className="text-2xl font-bold text-amz-terra mt-1">{bookings.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
                <p className="text-xs text-amz-terra-light uppercase tracking-wide">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-400">
                <p className="text-xs text-amz-terra-light uppercase tracking-wide">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-amz-terra text-sm">Reservas Recentes</h3>
              </div>
              {bookings.length === 0 ? (
                <p className="p-4 text-sm text-amz-terra-light text-center">Nenhuma reserva ainda</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-amz-terra truncate">
                          {booking.item_type === 'experience' ? 'Experiência' :
                           booking.item_type === 'class' ? 'Aula' : 'Produto'}
                        </p>
                        <p className="text-xs text-amz-terra-light">
                          {new Date(booking.booking_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-maybug text-xl text-amz-terra">Experiências</h2>
              <button
                onClick={openCreateModal}
                className="btn-primary !px-4 !py-2 !text-sm !rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-amz-terra-light text-sm">Nenhuma experiência cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp) => {
                  const cat = categories.find(c => c.id === exp.category_id)
                  return (
                    <div key={exp.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amz-oceano bg-amz-oceano/10 px-2 py-0.5 rounded-full">
                              {cat?.name || 'Sem categoria'}
                            </span>
                            <h3 className="text-base font-semibold text-amz-terra mt-1 truncate">
                              {exp.title}
                            </h3>
                            <p className="text-sm text-amz-terra-light mt-1">
                              {formatCurrency(exp.price)}
                              {exp.duration && ` · ${exp.duration}`}
                              {exp.level && ` · ${exp.level}`}
                            </p>
                            {exp.community && (
                              <p className="text-xs text-amz-terra-light/70 mt-1">
                                Comunidade: {exp.community}
                              </p>
                            )}
                          </div>
                          {exp.featured && (
                            <span className="text-amz-dourado text-xs">Destaque</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => openEditModal(exp)}
                            className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-amz-areia text-amz-terra hover:bg-amz-areia-dark transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-maybug text-xl text-amz-terra">Reservas</h2>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap bg-white text-amz-terra-light border border-gray-200 hover:border-amz-dourado transition-colors"
                >
                  {filter === 'all' ? 'Todas' : statusLabels[filter]}
                </button>
              ))}
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-amz-terra-light text-sm">Nenhuma reserva encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-amz-terra">
                          {booking.item_type === 'experience' ? 'Experiência' :
                           booking.item_type === 'class' ? 'Aula' : 'Produto'}
                        </p>
                        <p className="text-xs text-amz-terra-light mt-0.5">
                          {new Date(booking.booking_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        {booking.notes && (
                          <p className="text-xs text-amz-terra-light/70 mt-1 italic">
                            {booking.notes}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {(['dashboard', 'experiences', 'bookings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                activeTab === tab ? 'text-amz-dourado' : 'text-amz-terra-light'
              }`}
            >
              <TabIcon tab={tab} active={activeTab === tab} />
              <span className="text-[10px] font-medium">
                {tab === 'dashboard' ? 'Painel' :
                 tab === 'experiences' ? 'Experiências' : 'Reservas'}
              </span>
              {tab === 'bookings' && pendingCount > 0 && (
                <span className="absolute -mt-4 ml-4 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Modal: Create/Edit Experience */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal content */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Handle (mobile drag indicator) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-maybug text-lg text-amz-terra">
                  {editingExperience ? 'Editar Experiência' : 'Nova Experiência'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-amz-terra-light hover:text-amz-terra p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-amz-terra-light mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Downwind Ajuruteua → Salinas"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-amz-terra-light mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Descreva a experiência..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-amz-terra-light mb-1">Categoria *</label>
                <select
                  required
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado bg-white"
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amz-terra-light mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-amz-terra-light mb-1">Duração</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ex: 2h30"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                  />
                </div>
              </div>

              {/* Level + Community */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-amz-terra-light mb-1">Nível</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Todos os níveis">Todos os níveis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-amz-terra-light mb-1">Comunidade</label>
                  <input
                    type="text"
                    value={form.community}
                    onChange={(e) => setForm({ ...form, community: e.target.value })}
                    placeholder="Ex: Ajuruteua"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-amz-terra-light mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-medium text-amz-terra-light mb-1">URL do Vídeo</label>
                <input
                  type="url"
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-amz-terra focus:outline-none focus:ring-2 focus:ring-amz-dourado/30 focus:border-amz-dourado"
                />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-10 h-6 rounded-full transition-colors ${form.featured ? 'bg-amz-dourado' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm text-amz-terra">Destaque na página inicial</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-amz-terra-light hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 rounded-lg bg-amz-dourado text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    editingExperience ? 'Atualizar' : 'Criar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
