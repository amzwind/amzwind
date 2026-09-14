import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const { t } = useLanguage()

    useEffect(() => {
        let cancelled = false

        async function checkAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    if (!cancelled) {
                        setAuthorized(false)
                        setLoading(false)
                    }
                    return
                }

                if (!adminOnly) {
                    if (!cancelled) {
                        setAuthorized(true)
                        setLoading(false)
                    }
                    return
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (!cancelled) {
                    setAuthorized(profile?.role === 'admin')
                    setLoading(false)
                }
            } catch {
                if (!cancelled) {
                    setAuthorized(false)
                    setLoading(false)
                }
            }
        }

        checkAuth()

        return () => { cancelled = true }
    }, [adminOnly])

    if (loading) {
        return (
            <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center">
                <div className="text-amz-terra dark:text-amz-areia font-maybug text-xl animate-pulse">
                    {t.adminLoading || 'Verificando credenciais...'}
                </div>
            </div>
        )
    }

    if (!authorized) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
