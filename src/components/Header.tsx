import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { locales } from '../i18n/translations'
import { supabase } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-amz-terra-dark/90 backdrop-blur-xl border-b border-amz-areia-dark/50 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src={theme === 'dark' ? '/logo/logo-horizontal-branca.svg' : '/logo/logo-horizontal.svg'}
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
            <a href="/admin" className="btn-primary text-sm !px-4 !py-2">
              {t.navAdmin || 'Admin'}
            </a>
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
              <a href="/admin" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center mt-2">
                {t.navAdmin || 'Admin'}
              </a>
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
