import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function NotificationBadge() {
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const instanceId = useRef(Math.random().toString(36).slice(2))

  useEffect(() => {
    let cancelled = false

    async function fetchCount() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (!cancelled && count !== null) {
        setUnreadCount(count)
      }
    }

    fetchCount()

    const channel = supabase
      .channel(`badge-${instanceId.current}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          if (cancelled) return
          const newNotif = payload.new as { user_id?: string; read?: boolean }
          // Only increment if it's for the current user and unread
          if (newNotif && !newNotif.read) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          if (cancelled) return
          const old = payload.old as { read?: boolean }
          const updated = payload.new as { read?: boolean }
          // If was unread and now read, decrement
          if (old && !old.read && updated && updated.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
