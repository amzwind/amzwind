import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Locale, translations } from '../i18n/translations'

interface LanguageContextType {
  locale: Locale
  t: typeof translations['pt']
  setLocale: (l: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('amzwind-locale')
    return (stored as Locale) || 'pt'
  })

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('amzwind-locale', l)
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
