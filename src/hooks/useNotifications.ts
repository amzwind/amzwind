import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'

type Notification = Tables<'notifications'>

let channelCounter = 0

export function useNotifications(userId?: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const instanceId = useRef(++channelCounter)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      const uid = userId || user?.id
      if (!uid) {
        if (!cancelled) setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!cancelled && !error && data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
      if (!cancelled) setLoading(false)
    }

    fetchNotifications()

    const channelName = `notifications-realtime-${instanceId.current}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (cancelled) return
          const newNotif = payload.new as Notification
          setNotifications((prev) => [newNotif, ...prev].slice(0, 50))
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markAsRead = useCallback(async (notifId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notifId)

    if (!error) {
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === notifId)
        if (target && !target.read) {
          setUnreadCount((c) => Math.max(0, c - 1))
        }
        return prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      })
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!userId) return
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }, [userId])

  const dismiss = useCallback(async (notifId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notifId)

    if (!error) {
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === notifId)
        if (target && !target.read) {
          setUnreadCount((c) => Math.max(0, c - 1))
        }
        return prev.filter((n) => n.id !== notifId)
      })
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismiss,
  }
}
