import { useNotificationContext } from '../contexts/NotificationContext'
import type { Tables } from '../services/supabase'

export type Notification = Tables<'notifications'>

export function useNotifications(_userId?: string | null) {
  try {
    const context = useNotificationContext()
    return {
      notifications: context.notifications,
      unreadCount: context.unreadCount,
      loading: context.loading,
      markAsRead: context.markAsRead,
      markAllAsRead: context.markAllAsRead,
      dismiss: context.dismiss,
    }
  } catch {
    return {
      notifications: [],
      unreadCount: 0,
      loading: false,
      markAsRead: async () => {},
      markAllAsRead: async () => {},
      dismiss: async () => {},
    }
  }
}
