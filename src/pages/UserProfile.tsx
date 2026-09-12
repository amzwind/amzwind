import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Toast } from '../components/admin/SharedUI'
import { useLanguage } from '../contexts/LanguageContext'

type Profile = Tables<'profiles'>
type Booking = Tables<'bookings'>

interface BookingNotes {
  items?: { id: string; type: string; title: string; price: number; quantity: number }[]
  accommodation?: { check_in: string; check_out: string; nights: number; base_price_per_night: number; total: number }
  contact?: { name: string; email: string; phone: string; message: string }
  service?: string
  service_key?: string
  contact_name?: string
  contact_email?: string
  preferred_date?: string
  booking_date?: string
  message?: string
  subtotal?: number
  total?: number
}

function parseNotes(notes: string | null): BookingNotes | null {
  if (!notes) return null
  try { return JSON.parse(notes) as BookingNotes } catch { return null }
}

const TABS = ['portal', 'reservas', 'produtos', 'galeria'] as const
type Tab = typeof TABS[number]

export default function UserProfile() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('portal')

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }
      setUserEmail(session.user.email || '')

      const [pRes, bRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('bookings').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      ])

      if (pRes.data) {
        setProfile(pRes.data)
        setFullName(pRes.data.full_name || '')
        setBio(pRes.data.bio || '')
        setPhone(pRes.data.phone || '')
        setWhatsapp(pRes.data.whatsapp || '')
        setAvatarUrl(pRes.data.avatar_url || '')
      }
      if (bRes.data) setBookings(bRes.data)
      setLoading(false)
    }
    loadProfile()
  }, [navigate])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) {
      setToast({ message: 'Erro ao enviar avatar: ' + error.message, type: 'error' })
    } else {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      if (urlData?.publicUrl) setAvatarUrl(urlData.publicUrl)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (error) {
      setToast({ message: 'Erro ao salvar: ' + error.message, type: 'error' })
    } else {
      setProfile({
        ...profile,
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      setToast({ message: 'Perfil atualizado com sucesso!', type: 'success' })
    }
    setSaving(false)
  }

  async function handleCancelBooking(bookingId: string) {
    if (!window.confirm(t.customerCancelConfirm)) return
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    if (!error) {
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    }
  }

  function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  function parseBookingType(b: Booking): 'reserva' | 'produto' {
    if (b.item_type === 'product') return 'produto'
    return 'reserva'
  }

  function getBookingTitle(b: Booking): string {
    const notes = parseNotes(b.notes)
    if (notes?.items?.[0]?.title) return notes.items[0].title
    if (notes?.service) return notes.service
    return b.item_type === 'experience' ? 'Experiência' : b.item_type === 'class' ? 'Aula' : 'Produto'
  }

  function getBookingDate(b: Booking): string {
    const notes = parseNotes(b.notes)
    const dateStr = notes?.preferred_date || notes?.booking_date
    if (dateStr) return dateStr
    return new Date(b.created_at).toLocaleDateString('pt-BR')
  }

  function getBookingTotal(b: Booking): number {
    const notes = parseNotes(b.notes)
    if (notes?.total != null) return notes.total
    if (notes?.items) return notes.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return 0
  }

  const reservaBookings = bookings.filter((b) => parseBookingType(b) === 'reserva')
  const produtoBookings = bookings.filter((b) => parseBookingType(b) === 'produto')

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  }
  const statusLabels: Record<string, string> = {
    pending: t.customerStatusPending,
    confirmed: t.customerStatusConfirmed,
    cancelled: t.customerStatusCancelled,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-amz-terra-light dark:text-amz-areia/50 hover:text-amz-terra dark:hover:text-amz-areia mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>

          {/* Portal Header */}
          <div className="bg-gradient-to-br from-amz-oceano via-amz-terra to-amz-dourado rounded-3xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 600 200" className="w-full h-full"><path d="M0 120 Q 150 40, 300 120 Q 450 200, 600 120 V 200 H 0 Z" fill="white"/></svg>
            </div>
            <div className="relative flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center border-2 border-white/30">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold">{getInitials(fullName || profile?.full_name)}</span>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-amz-oceano rounded-lg flex items-center justify-center cursor-pointer shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-maybug truncate">{fullName || 'Amazon Wind Rider'}</h1>
                <p className="text-sm text-white/70 mt-0.5">{userEmail}</p>
                {bio && <p className="text-sm text-white/60 mt-1 line-clamp-2">{bio}</p>}
              </div>
            </div>
            <div className="relative grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
                <p className="text-xl font-bold">{reservaBookings.length}</p>
                <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider mt-0.5">Reservas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
                <p className="text-xl font-bold">{reservaBookings.filter((b) => b.status === 'confirmed').length}</p>
                <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider mt-0.5">Confirmadas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
                <p className="text-xl font-bold">{produtoBookings.length}</p>
                <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider mt-0.5">Produtos</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {([
              { key: 'portal' as const, icon: '👤', label: 'Perfil' },
              { key: 'reservas' as const, icon: '🌊', label: 'Minhas Reservas' },
              { key: 'produtos' as const, icon: '🛍️', label: 'Produtos' },
              { key: 'galeria' as const, icon: '📸', label: 'Galeria' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-amz-dourado text-white shadow-lg shadow-amz-dourado/20'
                    : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Portal / Profile */}
          {activeTab === 'portal' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5 space-y-5">
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia flex items-center gap-2">
                  <svg className="w-5 h-5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Dados Pessoais
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">Nome Completo</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">Bio do Atleta</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte sua história: desde quando pratica kitesurf, seus spots favoritos, conquistas..."
                    className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">E-mail</label>
                    <input
                      value={userEmail}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-100 dark:bg-white/[0.02] text-amz-terra-light dark:text-amz-areia/40 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">Telefone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(92) 99999-0000"
                      className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">
                    <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp (obrigatório para contato)
                  </label>
                  <input
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(92) 99999-0000"
                    className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Salvar Perfil'}
                </button>
              </div>

              {profile?.created_at && (
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                  Membro desde: {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
            </form>
          )}

          {/* Tab: Minhas Reservas */}
          {activeTab === 'reservas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia flex items-center gap-2">
                  <svg className="w-5 h-5 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /><circle cx="12" cy="12" r="10" /></svg>
                  Experiências & Aulas
                </h3>
                <span className="text-xs text-amz-terra-light dark:text-amz-areia/40">{reservaBookings.length} reserva(s)</span>
              </div>

              {reservaBookings.length === 0 ? (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
                  <div className="text-4xl mb-3">🌊</div>
                  <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">Nenhuma reserva ainda</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/30 mb-4">Suas experiências, aulas e downwinds aparecerão aqui</p>
                  <a href="/#experiencias" className="btn-primary inline-block text-sm">{t.heroCTA1}</a>
                </div>
              ) : (
                reservaBookings.map((b) => {
                  const notes = parseNotes(b.notes)
                  const isExpanded = expandedBooking === b.id
                  const itemTitle = getBookingTitle(b)
                  const bookingDate = getBookingDate(b)
                  const total = getBookingTotal(b)

                  return (
                    <div key={b.id} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden">
                      <button
                        onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amz-oceano/10 dark:bg-amz-oceano/20 flex items-center justify-center text-lg shrink-0">
                          {b.item_type === 'class' ? '🎓' : '🌊'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{itemTitle}</p>
                          <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 flex items-center gap-2 mt-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {bookingDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {total > 0 && <span className="text-sm font-bold text-amz-dourado">{formatBRL(total)}</span>}
                          <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${statusColors[b.status] || statusColors.pending}`}>
                            {statusLabels[b.status] || b.status}
                          </span>
                          <svg className={`w-4 h-4 text-amz-terra-light dark:text-amz-areia/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-amz-areia-dark/10 dark:border-white/5 space-y-3">
                          {notes?.items && notes.items.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                              {notes.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-amz-terra-light dark:text-amz-areia/50">{item.title} ×{item.quantity}</span>
                                  <span className="font-medium text-amz-terra dark:text-amz-areia">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {notes?.service && (
                            <div className="bg-amz-areia/30 dark:bg-white/[0.03] rounded-xl p-3 space-y-1">
                              <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{notes.service}</p>
                              {notes.preferred_date && <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">Data: {notes.preferred_date}</p>}
                              {notes.contact_name && <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{notes.contact_name}</p>}
                            </div>
                          )}

                          {b.status === 'pending' && (
                            <div className="pt-2">
                              <button onClick={() => handleCancelBooking(b.id)} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                                {t.customerCancelBooking}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Tab: Produtos Comprados */}
          {activeTab === 'produtos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia flex items-center gap-2">
                  <svg className="w-5 h-5 text-amz-dourado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Produtos Físicos
                </h3>
                <span className="text-xs text-amz-terra-light dark:text-amz-areia/40">{produtoBookings.length} produto(s)</span>
              </div>

              {produtoBookings.length === 0 ? (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
                  <div className="text-4xl mb-3">🛍️</div>
                  <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">Nenhum produto comprado</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/30 mb-4">Lycras, chapéus, acessórios e mais</p>
                  <a href="/loja" className="btn-primary inline-block text-sm">Ir à Loja</a>
                </div>
              ) : (
                produtoBookings.map((b) => {
                  const notes = parseNotes(b.notes)
                  const isExpanded = expandedBooking === b.id
                  const itemTitle = getBookingTitle(b)
                  const total = getBookingTotal(b)

                  return (
                    <div key={b.id} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden">
                      <button
                        onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amz-dourado/10 flex items-center justify-center text-lg shrink-0">
                          🛍️
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{itemTitle}</p>
                          <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                            Comprado em {new Date(b.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {total > 0 && <span className="text-sm font-bold text-amz-dourado">{formatBRL(total)}</span>}
                          <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${statusColors[b.status] || statusColors.pending}`}>
                            {statusLabels[b.status] || b.status}
                          </span>
                          <svg className={`w-4 h-4 text-amz-terra-light dark:text-amz-areia/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-amz-areia-dark/10 dark:border-white/5 space-y-3">
                          {notes?.items && notes.items.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                              {notes.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-amz-terra-light dark:text-amz-areia/50">{item.title} ×{item.quantity}</span>
                                  <span className="font-medium text-amz-terra dark:text-amz-areia">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                {b.status === 'confirmed' ? 'Produto entregue' : 'Aguardando confirmação'}
                              </p>
                              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/50">Status da entrega</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Tab: Galeria da Session */}
          {activeTab === 'galeria' && (
            <div className="space-y-6">
              <h3 className="font-maybug text-lg text-amz-terra dark:text-amz-areia flex items-center gap-2">
                <svg className="w-5 h-5 text-amz-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Galeria das Sessions
              </h3>

              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">
                Fotos oficiais tiradas pela equipe da Amazon Wind nas suas sessões. Baixe, comente e conecte-se com outros participantes.
              </p>

              {reservaBookings.filter((b) => b.status === 'confirmed').length === 0 ? (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">Nenhuma sessão concluída</p>
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/30">Complete uma experiência para acessar as fotos da session</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservaBookings
                    .filter((b) => b.status === 'confirmed')
                    .map((b) => {
                      const itemTitle = getBookingTitle(b)
                      const bookingDate = getBookingDate(b)

                      return (
                        <div key={b.id} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden">
                          <div className="p-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-amz-terra/10 dark:bg-amz-terra/20 flex items-center justify-center text-lg shrink-0">
                              📸
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{itemTitle}</p>
                              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">{bookingDate}</p>
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                              Concluída
                            </span>
                          </div>

                          <div className="px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden bg-amz-areia/30 dark:bg-white/[0.03] p-2">
                              <div className="aspect-square rounded-lg bg-amz-dourado/10 dark:bg-amz-dourado/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-amz-dourado/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                              <div className="aspect-square rounded-lg bg-amz-oceano/10 dark:bg-amz-oceano/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-amz-oceano/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                              <div className="aspect-square rounded-lg bg-amz-terra/10 dark:bg-amz-terra/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-amz-terra/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            </div>

                            <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 text-center">
                              Galeria será disponibilizada pela equipe em breve
                            </p>

                            <div className="bg-amz-areia/30 dark:bg-white/[0.03] rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                <span className="text-xs font-semibold text-amz-terra dark:text-amz-areia">Comentários da Trip</span>
                              </div>
                              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 italic">"Em breve você poderá comentar e interagir com outros participantes desta sessão!"</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}

          {/* Sign out */}
          <div className="mt-12 pt-8 border-t border-amz-areia-dark/20 dark:border-white/5">
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate('/', { replace: true }) }}
              className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors"
            >
              {t.adminLogout}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
