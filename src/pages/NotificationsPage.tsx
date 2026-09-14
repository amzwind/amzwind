import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotificationContext, type AppNotification } from '../contexts/NotificationContext'

const typeIcons: Record<string, string> = {
  friend_request: '👤',
  friend_accepted: '🤝',
  new_message: '💬',
  mention: '@',
  reaction: '❤️',
  comment: '💬',
  share: '↗️',
  group_invite: '👥',
  trip_invite: '🏄',
  new_trip: '🧭',
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
    case 'new_trip':
      return entityId ? `/trips/${entityId}` : '/trips'
    case 'group_invite':
      return '/conversas'
    default:
      if (entityType === 'trip') return entityId ? `/trips/${entityId}` : '/trips'
      if (entityType === 'post') return '/comunidade'
      return null
  }
}

type FilterCategory = 'all' | 'social' | 'trips' | 'messages'

export default function NotificationsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, dismiss } = useNotificationContext()
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all')

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'all') return notifications
    if (selectedFilter === 'social') {
      return notifications.filter((n) =>
        ['friend_request', 'friend_accepted', 'reaction', 'comment', 'share', 'mention'].includes(n.type)
      )
    }
    if (selectedFilter === 'trips') {
      return notifications.filter((n) => ['new_trip', 'trip_invite'].includes(n.type) || n.entity_type === 'trip')
    }
    if (selectedFilter === 'messages') {
      return notifications.filter((n) => ['new_message', 'group_message', 'group_invite'].includes(n.type))
    }
    return notifications
  }, [notifications, selectedFilter])

  function handleNotificationClick(notif: AppNotification) {
    if (!notif.read) {
      void markAsRead(notif.id)
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 md:pb-12 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 sm:px-8 py-4 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t.notificationsTitle || 'Notificações'}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => void markAllAsRead()}
              className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
            >
              {t.notificationsMarkAll || 'Marcar tudo como lido'}
            </button>
          )}
        </div>

        {/* Filtros em Abas */}
        <div className="max-w-4xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter('social')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedFilter === 'social'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Social & Feed
          </button>
          <button
            onClick={() => setSelectedFilter('trips')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedFilter === 'trips'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Trips & Expedições
          </button>
          <button
            onClick={() => setSelectedFilter('messages')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedFilter === 'messages'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Mensagens
          </button>
        </div>
      </header>

      {/* Main List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Carregando notificações em tempo real...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center mb-4 text-3xl">
              🔔
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              {selectedFilter === 'all'
                ? (t.notificationsEmpty || 'Você está em dia! Quando houver curtidas, comentários ou novas trips, elas aparecerão aqui.')
                : 'Não há notificações nesta categoria no momento.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800/60 overflow-hidden shadow-sm">
            {filteredNotifications.map((notif) => {
              const icon = typeIcons[notif.type] ?? '🔔'
              return (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleNotificationClick(notif)
                    }
                  }}
                  className={`group flex items-start gap-4 px-4 sm:px-6 py-4 transition-all cursor-pointer hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 ${
                    !notif.read ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {notif.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                        {formatTime(notif.created_at)}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-normal'} text-gray-900 dark:text-white leading-relaxed`}>
                      {notif.content ?? notif.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      void dismiss(notif.id)
                    }}
                    aria-label={t.bannerClose || 'Remover notificação'}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
