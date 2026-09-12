import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'

type Profile = Tables<'profiles'>

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || cancelled) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!cancelled) {
        setProfile(data)
        setLoading(false)
      }
    }

    fetchProfile()

    return () => { cancelled = true }
  }, [])

  async function saveWhatsApp(whatsapp: string): Promise<boolean> {
    if (!profile) return false

    const trimmed = whatsapp.trim()
    if (profile.whatsapp === trimmed) return true

    const { error } = await supabase
      .from('profiles')
      .update({ whatsapp: trimmed })
      .eq('id', profile.id)

    if (!error) {
      setProfile({ ...profile, whatsapp: trimmed })
      return true
    }
    return false
  }

  return { profile, loading, saveWhatsApp }
}
