import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Booking = Tables<'bookings'>
type Profile = Tables<'profiles'>

interface BookingNotes {
  items?: { id: string; type: string; title: string; price: number; quantity: number }[]
  accommodation?: { check_in: string; check_out: string; nights: number; base_price_per_night: number; total: number }
  contact?: { name: string; email: string; phone: string; message: string }
  service?: string
  service_key?: string
  contact_name?: string
  contact_email?: string
  preferred_date?: string
  message?: string
  subtotal?: number
  total?: number
}

function parseNotes(notes: string | null): BookingNotes | null {
  if (!notes) return null
  try { return JSON.parse(notes) as BookingNotes } catch { return null }
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login', { replace: true }); return }

      setUserEmail(session.user.email || '')

      const [pRes, bRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('bookings').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      ])
      if (pRes.data) {
        setProfile(pRes.data)
        setFullName(pRes.data.full_name || '')
        setPhone(pRes.data.phone || '')
      }
      if (bRes.data) setBookings(bRes.data)
      setLoading(false)
    }
    load()
  }, [navigate])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setSaveError('')
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', profile.id)
    if (error) {
      setSaveError(error.message)
      setSaving(false)
      return
    }
    setProfile({ ...profile, full_name: fullName, phone })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleCancelBooking(bookingId: string) {
    if (!window.confirm(t.customerCancelConfirm)) return
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    if (!error) {
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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
  const typeLabels: Record<string, string> = {
    experience: t.customerTypeExperience,
    class: t.customerTypeClass,
    product: t.customerTypeProduct,
  }
  const typeIcons: Record<string, string> = {
    experience: '🌊',
    class: '🎓',
    product: '📦',
  }

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Profile header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amz-dourado/10 dark:bg-amz-dourado/20 flex items-center justify-center text-lg font-bold text-amz-dourado shrink-0">
              {getInitials(fullName || profile?.full_name || null)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-maybug text-amz-terra dark:text-amz-areia truncate">{t.customerTitle}</h1>
              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 truncate">{userEmail}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/20 dark:border-white/5 text-center">
              <p className="text-2xl font-bold text-amz-terra dark:text-amz-areia">{bookings.length}</p>
              <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40 font-semibold uppercase tracking-wider mt-1">{t.customerStatsTotal}</p>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/20 dark:border-white/5 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{confirmedCount}</p>
              <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40 font-semibold uppercase tracking-wider mt-1">{t.customerStatsConfirmed}</p>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-amz-areia-dark/20 dark:border-white/5 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
              <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40 font-semibold uppercase tracking-wider mt-1">{t.customerStatsPending}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'bookings' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5'}`}>
              {t.customerBookings}
            </button>
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-amz-dourado text-white' : 'bg-white dark:bg-white/5 text-amz-terra dark:text-amz-areia border border-amz-areia-dark/20 dark:border-white/5'}`}>
              {t.customerProfile}
            </button>
          </div>

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
                  <p className="text-amz-terra-light dark:text-amz-areia/40">{t.customerNoBookings}</p>
                  <a href="/#experiencias" className="btn-primary inline-block mt-4 text-sm">{t.heroCTA1}</a>
                </div>
              ) : (
                bookings.map((b) => {
                  const notes = parseNotes(b.notes)
                  const isExpanded = expandedBooking === b.id

                  return (
                    <div key={b.id} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden">
                      <button
                        onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amz-dourado/10 flex items-center justify-center text-lg shrink-0">
                          {typeIcons[b.item_type] || '📋'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">
                            {notes?.items?.[0]?.title || notes?.service || typeLabels[b.item_type] || b.item_type}
                          </p>
                          <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                            {new Date(b.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {notes?.accommodation ? ` · ${notes.accommodation.nights} ${t.cartNights}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
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
                          {/* Items */}
                          {notes?.items && notes.items.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                              {notes.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-amz-terra-light dark:text-amz-areia/50">
                                    {typeIcons[item.type] || '•'} {item.title} ×{item.quantity}
                                  </span>
                                  <span className="font-medium text-amz-terra dark:text-amz-areia">
                                    R$ {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Accommodation */}
                          {notes?.accommodation && (
                            <div className="bg-amz-areia/30 dark:bg-white/[0.03] rounded-xl p-3 space-y-1">
                              <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{t.cartAccommodation}</p>
                              <div className="flex justify-between text-sm">
                                <span className="text-amz-terra-light dark:text-amz-areia/50">
                                  {notes.accommodation.check_in} → {notes.accommodation.check_out}
                                </span>
                                <span className="font-medium text-amz-terra dark:text-amz-areia">
                                  {notes.accommodation.nights} {t.cartNights}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-amz-terra-light dark:text-amz-areia/50">R$ {notes.accommodation.base_price_per_night}/noite</span>
                                <span className="font-medium text-amz-dourado">R$ {notes.accommodation.total.toFixed(2)}</span>
                              </div>
                            </div>
                          )}

                          {/* Service booking (Transfer/Hospedagem) */}
                          {notes?.service && (
                            <div className="bg-amz-areia/30 dark:bg-white/[0.03] rounded-xl p-3 space-y-1">
                              <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{notes.service}</p>
                              {notes.preferred_date && (
                                <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{t.customerBookingDate}: {notes.preferred_date}</p>
                              )}
                              {notes.contact_name && (
                                <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{notes.contact_name}</p>
                              )}
                              {notes.message && (
                                <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 italic">"{notes.message}"</p>
                              )}
                            </div>
                          )}

                          {/* Contact info */}
                          {notes?.contact && (
                            <div className="bg-amz-areia/30 dark:bg-white/[0.03] rounded-xl p-3 space-y-1">
                              <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{t.checkoutContactInfo}</p>
                              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{notes.contact.name}</p>
                              <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{notes.contact.email}</p>
                              {notes.contact.phone && <p className="text-sm text-amz-terra-light dark:text-amz-areia/50">{notes.contact.phone}</p>}
                            </div>
                          )}

                          {/* Total */}
                          {notes?.total != null && (
                            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-amz-areia-dark/10 dark:border-white/5">
                              <span className="text-amz-terra dark:text-amz-areia">{t.cartTotal}</span>
                              <span className="text-amz-dourado">R$ {notes.total.toFixed(2)}</span>
                            </div>
                          )}

                          {/* Actions */}
                          {b.status === 'pending' && (
                            <div className="pt-2">
                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                              >
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

          {/* Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.customerName}</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.customerPhone}</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">{t.customerEmail}</label>
                <input value={userEmail} disabled className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-100 dark:bg-white/[0.02] text-amz-terra-light dark:text-amz-areia/40 text-sm cursor-not-allowed" />
              </div>
              {profile?.created_at && (
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                  {t.customerJoinDate}: {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? '...' : t.customerSave}
                </button>
                {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{t.customerSaved}</span>}
                {saveError && <span className="text-sm text-red-500 dark:text-red-400 font-semibold">{saveError}</span>}
              </div>
            </form>
          )}

          {/* Sign out */}
          <div className="mt-12 pt-8 border-t border-amz-areia-dark/20 dark:border-white/5">
            <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors">
              {t.adminLogout}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
