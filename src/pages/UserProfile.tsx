import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, type Tables } from '../services/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Toast } from '../components/admin/SharedUI'

type Profile = Tables<'profiles'>

export default function UserProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      setUserEmail(session.user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setPhone(data.phone || '')
        setAvatarUrl(data.avatar_url || '')
      }
      setLoading(false)
    }
    loadProfile()
  }, [navigate])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)

    const ext = file.name.split('.').pop() || 'jpg'
    const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type })
    if (error) {
      setToast({ message: 'Erro ao enviar avatar: ' + error.message, type: 'error' })
    } else {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      if (urlData?.publicUrl) {
        setAvatarUrl(urlData.publicUrl)
      }
    }
    setUploadingAvatar(false)
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
        avatar_url: avatarUrl.trim() || null,
      })
      setToast({ message: 'Perfil atualizado com sucesso!', type: 'success' })
    }
    setSaving(false)
  }

  function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
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
        <div className="max-w-2xl mx-auto">
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-amz-terra-light dark:text-amz-areia/50 hover:text-amz-terra dark:hover:text-amz-areia mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>

          <h1 className="text-2xl font-maybug text-amz-terra dark:text-amz-areia mb-8">Meu Perfil</h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5">
              <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-3 uppercase tracking-wider">Foto de Perfil</label>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-amz-dourado/10 dark:bg-amz-dourado/20 flex items-center justify-center shrink-0 border-2 border-amz-areia-dark/20 dark:border-white/10">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-amz-dourado">{getInitials(fullName || profile?.full_name)}</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/[0.05] cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {uploadingAvatar ? 'Enviando...' : 'Alterar foto'}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-amz-areia-dark/20 dark:border-white/5 space-y-4">
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
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 text-sm resize-none"
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

              <div>
                <label className="block text-xs font-semibold text-amz-terra dark:text-amz-areia/60 mb-1.5 uppercase tracking-wider">E-mail</label>
                <input
                  value={userEmail}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-amz-areia-dark/30 dark:border-white/10 bg-gray-100 dark:bg-white/[0.02] text-amz-terra-light dark:text-amz-areia/40 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-4">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

            {/* Member since */}
            {profile?.created_at && (
              <p className="text-xs text-amz-terra-light dark:text-amz-areia/40">
                Membro desde: {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
