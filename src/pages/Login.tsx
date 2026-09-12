import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
        <div className="text-amz-terra dark:text-amz-areia font-maybug text-lg animate-pulse">
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#3D1D0F] max-w-md w-full p-8 rounded-2xl shadow-xl border border-amber-900/20 text-amz-terra-dark dark:text-amz-areia">
        <h1 className="font-maybug text-3xl mb-2 text-center text-amz-terra dark:text-amz-dourado">Amazon Wind</h1>
        <p className="text-xs uppercase tracking-widest text-center text-amz-terra-light dark:text-amz-areia/60 mb-6">Acesse sua conta</p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 text-xs rounded-lg text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold mb-1">E-mail</label>
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
            <label className="block text-xs uppercase font-semibold mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-amber-900/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amz-terra"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amz-terra text-white hover:bg-amz-terra-dark dark:bg-amz-dourado dark:text-amz-terra-dark py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition disabled:opacity-50 mt-4"
          >
            {submitting ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-amber-900/10 pt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-amz-terra-light dark:text-amz-areia/70 hover:text-amz-terra dark:hover:text-white transition"
          >
            ← Voltar para o site principal
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login