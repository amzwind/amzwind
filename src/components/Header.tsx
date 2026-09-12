import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { locales } from '../i18n/translations'
import { supabase } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { getFavoritesCount } = useFavorites()
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null)
  const cartCount = getFavoritesCount()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s) loadProfile(s.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) loadProfile(s.user.id)
      else setUserProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single()
    if (data) setUserProfile(data)
  }

  function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-amz-terra-dark/90 backdrop-blur-xl border-b border-amz-areia-dark/50 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src={theme === 'dark' ? '/logo-horizontal-branca.svg' : '/logo-horizontal.svg'}
            alt="Amazon Wind"
            className="h-10 transition-all duration-300"
          />
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-amz-terra dark:text-amz-areia"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#experiencias" className="text-sm font-medium text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            {t.navExperiencias}
          </a>
          <a href="#escola" className="text-sm font-medium text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            {t.navEscola}
          </a>
          <a href="#servicos" className="text-sm font-medium text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            {t.navServicos}
          </a>
          <a href="/sobre" className="text-sm font-medium text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            {t.aboutTitle ? 'Sobre' : 'About'}
          </a>

          {/* Cart */}
          <a href="/checkout" className="relative p-2 text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-amz-dourado text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                {cartCount}
              </span>
            )}
          </a>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors px-2 py-1 rounded-lg hover:bg-amz-areia dark:hover:bg-white/5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {locale.toUpperCase()}
              <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-amz-terra-dark rounded-xl shadow-xl border border-amz-areia-dark/50 dark:border-white/10 overflow-hidden min-w-[120px] animate-in fade-in slide-in-from-top-2 duration-200">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => { setLocale(loc.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      locale === loc.code
                        ? 'bg-amz-terra/10 dark:bg-white/10 text-amz-terra dark:text-amz-dourado font-semibold'
                        : 'text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{loc.flag}</span>
                    {loc.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-amz-areia dark:bg-amz-terra border-2 border-amz-areia-dark dark:border-amz-terra-light transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-amz-oceano/50"
            aria-label="Toggle theme"
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5.5 h-5.5 rounded-full bg-white dark:bg-amz-areia shadow-md transition-all duration-500 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </div>
          </button>

          {session ? (
            <div className="relative" data-user-menu>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
              >
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amz-dourado/10 dark:bg-amz-dourado/20 flex items-center justify-center text-xs font-bold text-amz-dourado">
                    {getInitials(userProfile?.full_name)}
                  </div>
                )}
                <svg className={`w-3 h-3 text-amz-terra dark:text-amz-areia transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-amz-terra-dark rounded-xl shadow-xl border border-amz-areia-dark/50 dark:border-white/10 overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-amz-areia-dark/50 dark:border-white/10">
                    <p className="text-sm font-semibold text-amz-terra dark:text-amz-areia truncate">
                      {userProfile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40 truncate">{session.user.email}</p>
                  </div>
                  <a
                    href="/perfil"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Meu Perfil
                  </a>
                  <a
                    href="/minha-conta"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Minhas Reservas
                  </a>
                  <a
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors border-t border-amz-areia-dark/50 dark:border-white/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Painel Admin
                  </a>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="btn-primary text-sm !px-4 !py-2">
              {t.navLogin || 'Entrar'}
            </a>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-amz-terra-dark border-t border-amz-areia-dark dark:border-white/10">
          <nav className="flex flex-col p-4 gap-3">
            <a href="#experiencias" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
              {t.navExperiencias}
            </a>
            <a href="#escola" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
              {t.navEscola}
            </a>
            <a href="#servicos" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
              {t.navServicos}
            </a>
            <a href="/sobre" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
              {t.aboutTitle ? 'Sobre' : 'About'}
            </a>
            <a href="/checkout" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Carrinho {cartCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-amz-dourado text-white text-[10px] font-bold rounded-full">{cartCount}</span>}
            </a>

            {/* Mobile Lang + Theme */}
            <div className="flex items-center justify-between py-2 border-t border-amz-areia-dark dark:border-white/10">
              <div className="flex gap-2">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => setLocale(loc.code)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      locale === loc.code
                        ? 'bg-amz-terra text-white'
                        : 'bg-amz-areia dark:bg-white/10 text-amz-terra dark:text-amz-areia'
                    }`}
                  >
                    {loc.flag} {loc.label}
                  </button>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="w-10 h-6 rounded-full bg-amz-areia dark:bg-amz-terra border-2 border-amz-areia-dark dark:border-amz-terra-light transition-colors relative"
                aria-label="Toggle theme"
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-amz-areia shadow transition-all duration-300 flex items-center justify-center text-[10px] ${
                    theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </div>
              </button>
            </div>

            {session ? (
              <div className="flex flex-col gap-2 mt-2 border-t border-amz-areia-dark dark:border-white/10 pt-3">
                <a href="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Meu Perfil
                </a>
                <a href="/minha-conta" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-amz-terra dark:text-amz-areia py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Minhas Reservas
                </a>
                <a href="/admin" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">
                  {t.navAdmin || 'Admin'}
                </a>
              </div>
            ) : (
              <a href="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center mt-2">
                {t.navLogin || 'Entrar'}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
