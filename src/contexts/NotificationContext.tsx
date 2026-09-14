import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode, type FC } from 'react'
import { supabase } from '../services/supabase'
import type { Tables } from '../services/supabase'

export type AppNotification = Tables<'notifications'>

export interface NotificationToastItem {
  id: string
  notification: AppNotification
  timestamp: number
}

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  activeToasts: NotificationToastItem[]
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  dismiss: (id: string) => Promise<void>
  dismissToast: (id: string) => void
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

/**
 * Toca um chime sintetizado elegante usando Web Audio API sem depender de arquivos externos
 */
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    // Primeiro tom suave
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.3)

    // Segundo tom harmônico
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
    gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.1)
    osc2.stop(ctx.currentTime + 0.5)
  } catch {
    // Silencia se áudio for bloqueado por política de autoplay
  }
}

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeToasts, setActiveToasts] = useState<NotificationToastItem[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const dismissToast = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const triggerToast = useCallback((notif: AppNotification) => {
    const toastItem: NotificationToastItem = {
      id: `${notif.id}-${Date.now()}`,
      notification: notif,
      timestamp: Date.now(),
    }
    setActiveToasts((prev) => [toastItem, ...prev].slice(0, 3))
    playNotificationChime()

    // Auto dismiss após 6.5 segundos
    setTimeout(() => {
      dismissToast(toastItem.id)
    }, 6500)
  }, [dismissToast])

  const fetchNotifications = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    }
    setLoading(false)
  }, [])

  const refreshNotifications = useCallback(async () => {
    if (currentUserId) {
      await fetchNotifications(currentUserId)
    }
  }, [currentUserId, fetchNotifications])

  useEffect(() => {
    let isMounted = true

    async function setupUserAndRealtime() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!isMounted) return

      if (!user) {
        setCurrentUserId(null)
        setNotifications([])
        setUnreadCount(0)
        setLoading(false)
        return
      }

      setCurrentUserId(user.id)
      await fetchNotifications(user.id)

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }

      const channelName = `global-user-notifications-${user.id}`
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isMounted) return
            const newNotif = payload.new as AppNotification
            setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)].slice(0, 50))
            if (!newNotif.read) {
              setUnreadCount((prev) => prev + 1)
              triggerToast(newNotif)
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isMounted) return
            const updated = payload.new as AppNotification
            setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
            setUnreadCount((prev) => {
              if (updated.read) {
                return Math.max(0, prev - 1)
              }
              return prev
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!isMounted) return
            const deletedId = (payload.old as { id?: string })?.id
            if (deletedId) {
              setNotifications((prev) => prev.filter((n) => n.id !== deletedId))
              setUnreadCount((prev) => Math.max(0, prev - 1))
            }
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    void setupUserAndRealtime()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user?.id) {
          setCurrentUserId(session.user.id)
          void fetchNotifications(session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUserId(null)
        setNotifications([])
        setUnreadCount(0)
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
          channelRef.current = null
        }
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [fetchNotifications, triggerToast])

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
    if (!currentUserId) return
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', currentUserId)
      .eq('read', false)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }, [currentUserId])

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

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        activeToasts,
        markAsRead,
        markAllAsRead,
        dismiss,
        dismissToast,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext deve ser utilizado dentro de um NotificationProvider')
  }
  return context
}
