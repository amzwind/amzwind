import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { useCart } from '../contexts/CartContext'
import { getBadgeDisplayValue } from '../lib/headerCounts'
import { locales } from '../i18n/translations'
import { supabase } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { getItemCount } = useCart()
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<{ full_name: string | null; avatar_url: string | null; role: string | null } | null>(null)
  const cartCount = getBadgeDisplayValue(getItemCount())

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

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, role')
      .eq('id', userId)
      .single()
    if (data) setUserProfile(data)
  }

  function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-amz-terra-dark/90 backdrop-blur-xl border-b border-amz-areia-dark/50 dark:border-white/5 transition-colors duration-500">
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
          aria-label={t.headerMenu}
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
            {t.headerAbout}
          </a>

          {/* Chat */}
          <a href="/conversas" aria-label="Conversas" className="relative p-2 text-amz-terra dark:text-amz-areia hover:text-amz-oceano dark:hover:text-amz-dourado transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amz-dourado ring-2 ring-white dark:ring-amz-terra-dark" />
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
            aria-label={t.headerToggleTheme}
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
                      {userProfile?.full_name || t.headerUserFallback}
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
                    {t.headerMyProfile}
                  </a>
                  <a
                    href="/conversas"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Conversas
                  </a>
                  <a
                    href="/amigos"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Amigos
                  </a>
                  {userProfile?.role === 'admin' && (
                    <a
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amz-terra dark:text-amz-areia hover:bg-amz-areia dark:hover:bg-white/5 transition-colors border-t border-amz-areia-dark/50 dark:border-white/10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t.headerAdminPanel}
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="btn-primary text-sm !px-4 !py-2">
              {t.headerLogin}
            </a>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-amz-areia dark:bg-[#091e24] overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amz-dourado/15 blur-3xl" />
            <div className="absolute bottom-10 -left-24 w-72 h-72 rounded-full bg-amz-oceano/15 blur-3xl" />
          </div>
          <nav className="relative flex flex-col min-h-full px-6 pt-4 pb-10">
            <div className="flex items-center justify-between mb-1">
              <img
                src={theme === 'dark' ? '/logo-horizontal-branca.svg' : '/logo-horizontal.svg'}
                alt="Amazon Wind"
                className="h-9"
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-amz-terra/5 dark:bg-white/10 text-amz-terra dark:text-amz-areia hover:bg-amz-dourado hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amz-dourado mb-2">Navegar</p>
            <a href="/" onClick={() => setMenuOpen(false)} style={{ animationDelay: '30ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">01</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amz-dourado to-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amz-dourado/25 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.navHome}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Voltar ao início</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="/trips" onClick={() => setMenuOpen(false)} style={{ animationDelay: '90ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">02</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amz-oceano to-amz-oceano-dark text-white flex items-center justify-center shrink-0 shadow-lg shadow-amz-oceano/25 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.navTrips}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Downwinds & expedições</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="/experiencias" onClick={() => setMenuOpen(false)} style={{ animationDelay: '150ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">03</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amz-bio to-emerald-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/25 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.expTitle}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Aulas, vivências e pacotes</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="/comunidade" onClick={() => setMenuOpen(false)} style={{ animationDelay: '210ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">04</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amz-terra to-amz-terra-dark text-white flex items-center justify-center shrink-0 shadow-lg shadow-amz-terra/25 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.navCommunity}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Feed dos riders</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="/amigos" onClick={() => setMenuOpen(false)} style={{ animationDelay: '270ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">05</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amz-dourado text-white flex items-center justify-center shrink-0 shadow-lg shadow-amz-dourado/25 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.friendsTitle}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Conexões e convites</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="/conversas" onClick={() => setMenuOpen(false)} style={{ animationDelay: '330ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5 border-b border-amz-terra/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">06</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-[#091e24] text-white flex items-center justify-center shrink-0 shadow-lg shadow-teal-950/30 group-active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none">{t.convTitle}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">Suas mensagens</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href={session ? '/perfil' : '/login'} onClick={() => setMenuOpen(false)} style={{ animationDelay: '390ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] group flex items-center gap-4 py-3.5">
              <span className="text-[11px] font-bold text-amz-terra-light/60 dark:text-white/30 w-6">07</span>
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-stone-500 to-stone-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-stone-900/25 group-active:scale-95 transition-transform overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-maybug text-2xl text-amz-terra dark:text-amz-areia leading-none truncate">{userProfile?.full_name || t.navProfile}</span>
                <span className="block text-[11px] text-amz-terra-light dark:text-white/40 mt-1">{session ? (session.user.email || 'Sua conta') : t.headerLogin}</span>
              </span>
              <svg className="w-5 h-5 text-amz-dourado shrink-0 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>

            {/* Menu footer: idioma, tema e atalhos */}
            <div style={{ animationDelay: '450ms' }} className="animate-[menuItemIn_0.45s_ease-out_both] mt-6 rounded-3xl bg-amz-terra/5 dark:bg-white/5 border border-amz-terra/10 dark:border-white/10 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => setLocale(loc.code)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        locale === loc.code
                          ? 'bg-amz-dourado text-white shadow-md shadow-amz-dourado/30'
                          : 'bg-white dark:bg-white/10 text-amz-terra dark:text-amz-areia'
                      }`}
                    >
                      {loc.flag} {loc.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={toggleTheme}
                  className="h-8 px-3 rounded-full bg-white dark:bg-white/10 border border-amz-terra/10 dark:border-white/10 text-amz-terra dark:text-amz-areia text-xs font-semibold flex items-center gap-1.5"
                  aria-label={t.headerToggleTheme}
                >
                  <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                  {theme === 'dark' ? 'Escuro' : 'Claro'}
                </button>
              </div>

              <div className="flex gap-2">
                <a href="/checkout" onClick={() => setMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-amz-terra dark:bg-white/10 text-white dark:text-amz-areia text-xs font-bold">
                  {t.headerCart}
                  {cartCount > 0 && <span className="px-1.5 py-0.5 bg-amz-dourado text-white text-[10px] font-bold rounded-full">{cartCount}</span>}
                </a>
                {userProfile?.role === 'admin' && (
                  <a href="/admin" onClick={() => setMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-amz-dourado/40 text-amz-dourado text-xs font-bold">
                    {t.headerAdminPanel}
                  </a>
                )}
              </div>

              {!session && (
                <a href="/login" onClick={() => setMenuOpen(false)} className="block text-center py-3 rounded-2xl bg-gradient-to-r from-amz-dourado to-amber-500 text-white text-sm font-bold shadow-lg shadow-amz-dourado/25">
                  {t.headerLogin}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
