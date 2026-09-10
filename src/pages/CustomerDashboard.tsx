import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Booking = Tables<'bookings'>
type Profile = Tables<'profiles'>

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

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login', { replace: true }); return }

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
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', profile.id)
    setProfile({ ...profile, full_name: fullName, phone })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
  const statusLabels: Record<string, string> = { pending: 'Pendente', confirmed: 'Confirmada', cancelled: 'Cancelada' }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark transition-colors duration-500">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-maybug text-amz-terra dark:text-amz-areia">{t.customerTitle}</h1>
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/50 mt-1">{t.customerSubtitle}</p>
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
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
                  <p className="text-amz-terra-light dark:text-amz-areia/40">{t.customerNoBookings}</p>
                  <a href="/#experiencias" className="btn-primary inline-block mt-4 text-sm">{t.heroCTA1}</a>
                </div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-amz-areia-dark/20 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amz-dourado/10 flex items-center justify-center text-lg">
                          {b.item_type === 'experience' ? '🌊' : b.item_type === 'class' ? '🎓' : '📦'}
                        </div>
                        <div>
                          <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm">
                            {b.item_type === 'experience' ? 'Experiência' : b.item_type === 'class' ? 'Aula' : 'Produto'}
                          </p>
                          <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                            {new Date(b.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${statusColors[b.status] || statusColors.pending}`}>
                        {statusLabels[b.status] || b.status}
                      </span>
                    </div>
                    {b.notes && <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 mt-3 pl-13">{b.notes}</p>}
                  </div>
                ))
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
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5">E-mail</label>
                <input value={profile?.id || ''} disabled className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-100 dark:bg-white/[0.02] text-amz-terra-light dark:text-amz-areia/40 text-sm cursor-not-allowed" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? '...' : t.customerSave}
                </button>
                {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{t.customerSaved}</span>}
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
