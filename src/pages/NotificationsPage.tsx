import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../services/supabase'
import { useNotifications } from '../hooks/useNotifications'
import { useEffect } from 'react'

const typeIcons: Record<string, string> = {
  friend_request: '👤',
  friend_accepted: '🤝',
  new_message: '💬',
  mention: '@',
  reaction: '❤️',
  comment: '💬',
  share: '↗️',
  group_invite: '👥',
  trip_invite: '🏍️',
  group_message: '👥',
}

function getNotificationRoute(type: string, entityType: string | null, entityId: string | null): string | null {
  switch (type) {
    case 'friend_request':
    case 'friend_accepted':
      return '/amigos'
    case 'new_message':
    case 'group_message':
      return entityId ? `/chat/${entityId}` : '/conversas'
    case 'reaction':
    case 'comment':
    case 'share':
    case 'mention':
      return entityType === 'post' ? '/comunidade' : null
    case 'trip_invite':
      return entityId ? `/trips/${entityId}` : '/trips'
    case 'group_invite':
      return '/conversas'
    default:
      return null
  }
}

export default function NotificationsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, dismiss } = useNotifications(userId)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  function handleNotificationClick(notif: { id: string; read: boolean; type: string; entity_type: string | null; entity_id: string | null }) {
    if (!notif.read) markAsRead(notif.id)
    const route = getNotificationRoute(notif.type, notif.entity_type, notif.entity_id)
    if (route) navigate(route)
  }

  function formatTime(iso: string): string {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return t.notificationNow || 'Agora'
    if (diffMin < 60) return `${diffMin}${t.notificationMin || 'min'}`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `${diffH}${t.notificationHour || 'h'}`
    const diffD = Math.floor(diffH / 24)
    return `${diffD}${t.notificationDay || 'd'}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 md:pb-4">
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t.notificationsTitle || 'Notificações'}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-emerald-500 dark:text-emerald-400 font-medium"
          >
            {t.notificationsMarkAll || 'Marcar tudo como lido'}
          </button>
        )}
      </header>

      <main>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">
              🔔
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t.notificationsEmpty || 'Nenhuma notificação ainda.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNotificationClick(notif) } }}
                className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''
                }`}
                onClick={() => handleNotificationClick(notif)}
              >
                <span className="text-xl mt-0.5 flex-shrink-0">
                  {typeIcons[notif.type] ?? '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.read ? 'font-medium' : ''} text-gray-900 dark:text-white`}>
                    {notif.content ?? notif.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatTime(notif.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                  aria-label={t.bannerClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
