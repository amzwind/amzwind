import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationContext, type NotificationToastItem } from '../../contexts/NotificationContext'

const typeConfig: Record<string, { icon: string; label: string; badgeColor: string }> = {
  friend_request: { icon: '👤', label: 'Nova solicitação de amizade', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  friend_accepted: { icon: '🤝', label: 'Amizade conectada', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  new_message: { icon: '💬', label: 'Nova mensagem', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  group_message: { icon: '👥', label: 'Mensagem no grupo', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  reaction: { icon: '❤️', label: 'Curtida recebida', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  comment: { icon: '💬', label: 'Novo comentário', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  share: { icon: '↗️', label: 'Post compartilhado', badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  mention: { icon: '@', label: 'Menção em post', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  new_trip: { icon: '🧭', label: 'Nova Trip anunciada', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  trip_invite: { icon: '🏄', label: 'Convite para Trip', badgeColor: 'bg-amz-dourado/20 text-amz-dourado border-amz-dourado/40' },
}

function resolveNotificationRoute(type: string, entityType: string | null, entityId: string | null): string {
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
      return '/comunidade'
    case 'new_trip':
    case 'trip_invite':
      return entityId ? `/trips/${entityId}` : '/trips'
    default:
      if (entityType === 'trip') return entityId ? `/trips/${entityId}` : '/trips'
      if (entityType === 'post') return '/comunidade'
      return '/notifications'
  }
}

export const InAppNotificationToast: FC = () => {
  const { activeToasts, dismissToast, markAsRead } = useNotificationContext()
  const navigate = useNavigate()

  if (activeToasts.length === 0) return null

  const handleToastClick = (toast: NotificationToastItem) => {
    void markAsRead(toast.notification.id)
    dismissToast(toast.id)
    const route = resolveNotificationRoute(
      toast.notification.type,
      toast.notification.entity_type,
      toast.notification.entity_id
    )
    navigate(route)
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 flex flex-col gap-2 pointer-events-none"
    >
      {activeToasts.map((toast) => {
        const conf = typeConfig[toast.notification.type] || {
          icon: '🔔',
          label: 'Notificação AMZWind',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        }

        return (
          <div
            key={toast.id}
            role="alert"
            onClick={() => handleToastClick(toast)}
            className="pointer-events-auto group relative overflow-hidden rounded-xl bg-[#091e24]/95 dark:bg-[#07171c]/95 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400/60 shadow-2xl p-3.5 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-start gap-3">
              {/* Ícone estilizado com glow */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                {conf.icon}
              </div>

              {/* Conteúdo textual */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${conf.badgeColor}`}>
                    {conf.label}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-auto">Agora</span>
                </div>
                <p className="text-sm font-medium text-white line-clamp-2 leading-snug">
                  {toast.notification.content || 'Você tem uma nova interação na plataforma.'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 group-hover:text-emerald-300 font-medium transition-colors">
                  <span>Toque para ver</span>
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Botão de Fechar */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  dismissToast(toast.id)
                }}
                className="flex-shrink-0 text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Fechar notificação"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Barra de progresso de auto-dismiss */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 animate-[shrink_6.5s_linear_forwards]"
                style={{
                  animation: 'shrinkBar 6.5s linear forwards',
                }}
              />
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
