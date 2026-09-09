import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    setAuthorized(false)
                    setLoading(false)
                    return
                }

                // Verifica se é admin na tabela profiles
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (profile?.role === 'admin') {
                    setAuthorized(true)
                } else {
                    setAuthorized(false)
                }
            } catch (err) {
                console.error('Erro na autenticação:', err)
                setAuthorized(false)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
                <div className="text-amz-terra dark:text-amz-areia font-maybug text-xl animate-pulse">
                    Verificando credenciais Amazon Wind...
                </div>
            </div>
        )
    }

    if (!authorized) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}