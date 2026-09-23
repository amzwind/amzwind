import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export function Login() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await redirectByRole(session.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [navigate])

  async function redirectByRole(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (data?.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/perfil', { replace: true })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        await redirectByRole(data.user.id)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Credenciais inválidas.'
      setErrorMessage(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-lg animate-pulse">
          {t.loginLoading}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#3D1D0F] max-w-md w-full p-8 rounded-2xl shadow-xl border border-amber-900/20 text-amz-terra-dark dark:text-amz-areia">
        <h1 className="font-maybug text-3xl mb-2 text-center text-amz-terra dark:text-amz-dourado">Amazon Wind</h1>
        <p className="text-xs uppercase tracking-widest text-center text-amz-terra-light dark:text-amz-areia/60 mb-6">{t.loginSubtitle}</p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 text-xs rounded-lg text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold mb-1">{t.loginEmail}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold mb-1">{t.loginPassword}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amz-terra-light dark:text-amz-areia/50 hover:text-amz-terra dark:hover:text-amz-areia transition-colors p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  /* Olho fechado */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  /* Olho aberto */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amz-terra text-white hover:bg-amz-terra-dark dark:bg-amz-dourado dark:text-amz-terra-dark py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition disabled:opacity-50 mt-4"
          >
            {submitting ? t.loginAuthenticating : t.loginButton}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-amber-900/10 pt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-amz-terra-light dark:text-amz-areia/70 hover:text-amz-terra dark:hover:text-white transition"
          >
            {t.loginBack}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login