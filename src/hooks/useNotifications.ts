import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'

type Notification = Tables<'notifications'>

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!cancelled && !error && data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
      if (!cancelled) setLoading(false)
    }

    fetchNotifications()

    const channel = supabase
      .channel('notifications-realtime')
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
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
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
      setNotifications((prev) => prev.filter((n) => n.id !== notifId))
      setUnreadCount((prev) => {
        const notif = notifications.find((n) => n.id === notifId)
        return notif && !notif.read ? Math.max(0, prev - 1) : prev
      })
    }
  }, [notifications])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismiss,
  }
}
