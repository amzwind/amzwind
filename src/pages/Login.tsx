import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Pronto para login')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Autenticando...')

    try {
      // Usando apenas o error para satisfazer o TypeScript estrito
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      setStatus('Sucesso! Redirecionando...')
      setTimeout(() => {
        navigate('/admin')
      }, 500)
    } catch (err: any) {
      setStatus('Erro: ' + (err.message || 'Falha ao autenticar'))
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', color: '#333' }}>
      <h2>Amazon Wind — Login Teste</h2>
      <p style={{ fontSize: '12px', color: '#666' }}>Status: {status}</p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            placeholder="admin@amazonwind.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          style={{ padding: '12px', background: '#0284c7', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Entrar no Sistema
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: 0 }}>
          ← Voltar para a Home
        </button>
      </div>
    </div>
  )
}