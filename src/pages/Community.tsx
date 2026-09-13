import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import Feed from '../components/feed/Feed'

export default function Community() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id: string; full_name: string | null; avatar_url: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false)
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', data.user.id)
        .single()
      setUser({
        id: data.user.id,
        full_name: profile?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
      })
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] flex items-center justify-center pb-20 md:pb-4">
        <div className="w-8 h-8 border-2 border-amz-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
        <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label={t.adminBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">
            {t.communityTitle || 'Comunidade'}
          </h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amz-dourado" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-amz-terra-light dark:text-amz-areia/60 text-sm mb-1">
            {t.communityLoginPrompt || 'Faça login para acessar a comunidade'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2.5 rounded-xl bg-amz-dourado text-white font-semibold text-sm hover:bg-amz-dourado/90 transition-colors"
          >
            {t.communityLoginButton || 'Entrar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-[#1a0f08] pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-amz-areia/95 dark:bg-[#1a0f08]/95 backdrop-blur-lg border-b border-amz-areia-dark/20 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label={t.adminBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 text-amz-terra dark:text-amz-areia"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia">
          {t.communityTitle || 'Comunidade'}
        </h1>
      </header>
      <main className="px-4 py-4 max-w-2xl mx-auto">
        <Feed
          currentUserId={user.id}
          currentUserName={user.full_name}
          currentUserAvatar={user.avatar_url}
        />
      </main>
    </div>
  )
}
