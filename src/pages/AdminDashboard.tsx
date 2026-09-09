import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'

type Experience = Tables<'experiences'>
type Category = Tables<'categories'>
type Booking = Tables<'bookings'>

type Tab = 'dashboard' | 'experiences' | 'bookings'

// Gera slug a partir do título
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

// Toast simples
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`fixed top-4 left-4 right-4 z-[60] p-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-[slideDown_0.3s_ease-out] ${
      type === 'success'
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-70">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function AdminDashboard() {
  const navigate = useNavigate()

  // Auth
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Tab
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  // Dados
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form
  const emptyForm = {
    title: '', description: '', category_id: '', price: '',
    duration: '', level: '', community: '', image_url: '',
    video_url: '', featured: false,
  }
  const [form, setForm] = useState(emptyForm)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  // ─── AUTH CHECK ────────────────────────────────────────
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!data || data.role !== 'admin') {
        await supabase.auth.signOut()
        navigate('/login', { replace: true })
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    checkAdmin()
  }, [navigate])

  // ─── LOAD DATA ────────────────────────────────────────
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

  // ─── MODAL CONTROLS ───────────────────────────────────
  function openCreateModal() {
    setEditingExp(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' })
    setShowModal(true)
  }

  function openEditModal(exp: Experience) {
    setEditingExp(exp)
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

  // ─── CRUD: CREATE / UPDATE ────────────────────────────
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
    if (editingExp) {
      const res = await supabase.from('experiences').update(payload).eq('id', editingExp.id)
      error = res.error
    } else {
      const res = await supabase.from('experiences').insert(payload)
      error = res.error
    }

    if (error) {
      showToast(`Erro: ${error.message}`, 'error')
    } else {
      showToast(editingExp ? 'Experiência atualizada!' : 'Experiência criada!', 'success')
      setShowModal(false)
      await loadData()
    }

    setFormLoading(false)
  }

  // ─── CRUD: DELETE ─────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return

    const { error } = await supabase.from('experiences').delete().eq('id', id)
    if (error) {
      showToast(`Erro ao excluir: ${error.message}`, 'error')
    } else {
      showToast('Experiência excluída.', 'success')
      await loadData()
    }
  }

  // ─── BOOKING STATUS ──────────────────────────────────
  async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) {
      showToast(`Erro: ${error.message}`, 'error')
    } else {
      showToast(`Reserva ${status === 'confirmed' ? 'confirmada' : 'cancelada'}.`, 'success')
      await loadData()
    }
  }

  // ─── SIGN OUT ─────────────────────────────────────────
  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  // ─── LOADING ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amz-areia dark:bg-amz-terra-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-amz-terra-light dark:text-amz-areia/60 font-maybug">Carregando painel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark pb-24 transition-colors duration-300">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-amz-terra/90 backdrop-blur-xl border-b border-amber-900/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="font-maybug text-lg text-amz-terra dark:text-amz-areia">Amazon Wind</h1>
            <p className="text-[10px] uppercase tracking-widest text-amz-terra-light dark:text-amz-areia/50">Painel Administrativo</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-medium text-amz-terra-light dark:text-amz-areia/60 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center gap-2 max-w-5xl mx-auto px-4 pt-4">
        {([
          { key: 'dashboard' as Tab, label: 'Painel' },
          { key: 'experiences' as Tab, label: 'Experiências' },
          { key: 'bookings' as Tab, label: 'Reservas' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-amz-terra text-white dark:bg-amz-dourado dark:text-amz-terra-dark shadow-md'
                : 'text-amz-terra-light dark:text-amz-areia/60 hover:bg-white dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
            {tab.key === 'bookings' && pendingCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 pt-4">

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="font-maybug text-xl text-amz-terra dark:text-amz-areia">Visão Geral</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-amber-900/5">
                <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50">Experiências</p>
                <p className="text-3xl font-maybug text-amz-terra dark:text-amz-areia mt-1">{experiences.length}</p>
              </div>
              <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border border-amber-900/5">
                <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50">Reservas</p>
                <p className="text-3xl font-maybug text-amz-terra dark:text-amz-areia mt-1">{bookings.length}</p>
              </div>
              <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
                <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50">Pendentes</p>
                <p className="text-3xl font-maybug text-yellow-600 dark:text-yellow-400 mt-1">{pendingCount}</p>
              </div>
              <div className="bg-white dark:bg-white/5 rounded-xl p-4 shadow-sm border-l-4 border-green-400">
                <p className="text-[10px] uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50">Confirmadas</p>
                <p className="text-3xl font-maybug text-green-600 dark:text-green-400 mt-1">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>

            {/* Reservas recentes */}
            <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm overflow-hidden border border-amber-900/5">
              <div className="px-4 py-3 border-b border-amber-900/5">
                <h3 className="font-semibold text-amz-terra dark:text-amz-areia text-sm">Reservas Recentes</h3>
              </div>
              {bookings.length === 0 ? (
                <p className="p-6 text-sm text-amz-terra-light dark:text-amz-areia/40 text-center italic">Nenhuma reserva ainda</p>
              ) : (
                <div className="divide-y divide-amber-900/5">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-amz-terra dark:text-amz-areia truncate">
                          {b.item_type === 'experience' ? 'Experiência' : b.item_type === 'class' ? 'Aula' : 'Produto'}
                        </p>
                        <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                          {new Date(b.booking_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ EXPERIENCES TAB ═══ */}
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-maybug text-xl text-amz-terra dark:text-amz-areia">Experiências</h2>
              <button onClick={openCreateModal} className="btn-primary !px-4 !py-2 !text-sm !rounded-xl">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="bg-white dark:bg-white/5 rounded-xl p-8 text-center shadow-sm border border-amber-900/5">
                <p className="text-amz-terra-light dark:text-amz-areia/40 text-sm">Nenhuma experiência cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp) => {
                  const cat = categories.find(c => c.id === exp.category_id)
                  return (
                    <div key={exp.id} className="bg-white dark:bg-white/5 rounded-xl shadow-sm overflow-hidden border border-amber-900/5">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-amz-oceano bg-amz-oceano/10 px-2 py-0.5 rounded-full">
                              {cat?.name || 'Sem categoria'}
                            </span>
                            <h3 className="text-base font-semibold text-amz-terra dark:text-amz-areia mt-1.5 truncate">
                              {exp.title}
                            </h3>
                            <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mt-0.5">
                              {formatCurrency(exp.price)}
                              {exp.duration && ` · ${exp.duration}`}
                              {exp.level && ` · ${exp.level}`}
                            </p>
                            {exp.community && (
                              <p className="text-xs text-amz-terra-light/50 dark:text-amz-areia/30 mt-0.5">
                                Comunidade: {exp.community}
                              </p>
                            )}
                          </div>
                          {exp.featured && (
                            <span className="text-[10px] font-semibold text-amz-dourado bg-amz-dourado/10 px-2 py-0.5 rounded-full shrink-0">
                              Destaque
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => openEditModal(exp)}
                            className="flex-1 text-center text-xs font-semibold py-2.5 rounded-lg bg-amz-areia dark:bg-white/5 text-amz-terra dark:text-amz-areia hover:bg-amz-areia-dark dark:hover:bg-white/10 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="flex-1 text-center text-xs font-semibold py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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

        {/* ═══ BOOKINGS TAB ═══ */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-maybug text-xl text-amz-terra dark:text-amz-areia">Reservas</h2>

            {bookings.length === 0 ? (
              <div className="bg-white dark:bg-white/5 rounded-xl p-8 text-center shadow-sm border border-amber-900/5">
                <p className="text-amz-terra-light dark:text-amz-areia/40 text-sm">Nenhuma reserva encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-white/5 rounded-xl shadow-sm p-4 border border-amber-900/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia">
                          {booking.item_type === 'experience' ? 'Experiência' : booking.item_type === 'class' ? 'Aula' : 'Produto'}
                        </p>
                        <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-0.5">
                          {new Date(booking.booking_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        {booking.notes && (
                          <p className="text-xs text-amz-terra-light/50 dark:text-amz-areia/30 mt-1 italic">{booking.notes}</p>
                        )}
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase shrink-0 ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="flex-1 text-center text-xs font-semibold py-2.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex-1 text-center text-xs font-semibold py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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

      {/* ═══ BOTTOM NAV (Mobile) ═══ */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-amz-terra-dark/95 backdrop-blur-xl border-t border-amber-900/10 z-40 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {([
            { key: 'dashboard' as Tab, label: 'Painel', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )},
            { key: 'experiences' as Tab, label: 'Experiências', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )},
            { key: 'bookings' as Tab, label: 'Reservas', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ), badge: pendingCount },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                activeTab === tab.key ? 'text-amz-dourado' : 'text-amz-terra-light dark:text-amz-areia/40'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {'badge' in tab && tab.badge && tab.badge > 0 && (
                <span className="absolute -mt-5 ml-3 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══ MODAL: CREATE / EDIT EXPERIENCE ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#3D1D0F] rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Mobile handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-maybug text-lg text-amz-terra dark:text-amz-areia">
                  {editingExp ? 'Editar Experiência' : 'Nova Experiência'}
                </h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-amz-terra-light hover:text-amz-terra p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Título *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Downwind Ajuruteua → Salinas"
                  className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Descrição</label>
                <textarea
                  value={form.description} rows={3}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva a experiência..."
                  className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 resize-none transition-all"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Categoria *</label>
                <select
                  required value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Preço + Duração */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Preço (R$) *</label>
                  <input
                    type="number" required min="0" step="0.01" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Duração</label>
                  <input
                    type="text" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ex: 2h30"
                    className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                  />
                </div>
              </div>

              {/* Nível + Comunidade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Nível</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                  >
                    <option value="">Todos</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Todos os níveis">Todos os níveis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">Comunidade</label>
                  <input
                    type="text" value={form.community}
                    onChange={(e) => setForm({ ...form, community: e.target.value })}
                    placeholder="Ex: Ajuruteua"
                    className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                  />
                </div>
              </div>

              {/* URLs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">URL da Imagem</label>
                <input
                  type="url" value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amz-terra-light dark:text-amz-areia/50 mb-1">URL do Vídeo</label>
                <input
                  type="url" value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2.5 rounded-lg border border-amber-900/20 bg-transparent text-sm text-amz-terra dark:text-amz-areia focus:outline-none focus:ring-2 focus:ring-amz-dourado/40 transition-all"
                />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-amz-dourado' : 'bg-gray-200 dark:bg-white/10'}`}
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-amz-terra dark:text-amz-areia">Destaque na página inicial</span>
              </label>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-amber-900/20 text-sm font-semibold text-amz-terra-light dark:text-amz-areia/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit" disabled={formLoading}
                  className="flex-1 py-2.5 rounded-lg bg-amz-dourado text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : editingExp ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
