import { type MessageWithMeta } from '../../services/chat'
import { useLanguage } from '../../contexts/LanguageContext'

interface MessageBubbleProps {
  message: MessageWithMeta
  isOwn: boolean
  currentUserId?: string
  onReply: () => void
  onReact: (reaction: string) => void
  onDelete: () => void
  showEmojiPicker: string | null
  setShowEmojiPicker: (id: string | null) => void
  quickReactions: string[]
  contextMenu: { messageId: string; x: number; y: number } | null
  setContextMenu: (menu: { messageId: string; x: number; y: number } | null) => void
}

export default function MessageBubble({
  message,
  isOwn,
  onReply,
  onReact,
  onDelete,
  showEmojiPicker,
  setShowEmojiPicker,
  quickReactions,
  contextMenu,
  setContextMenu,
}: MessageBubbleProps) {
  const { t } = useLanguage()
  function handleLongPress(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setContextMenu({ messageId: message.id, x: rect.left, y: rect.top })
  }

  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
          {message.content ?? (t.chatDeletedMessage || 'Mensagem apagada')}
        </span>
      </div>
    )
  }

  const reactionEntries = Object.entries(message.reactions ?? {})

  return (
    <div
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-1 group`}
      onContextMenu={handleLongPress}
    >
      {/* Reply preview */}
      {message.reply_to_id && message.reply_content && (
        <div className={`max-w-[80%] mb-1 px-3 py-1.5 rounded-lg text-xs ${
          isOwn
            ? 'bg-emerald-600/30 text-emerald-100'
            : 'bg-amz-areia-dark/70 dark:bg-white/10 text-amz-terra-light dark:text-white/60'
        }`}>
          <span className="font-semibold">{message.reply_sender_name ?? (t.chatRiderFallback || 'Rider')}</span>
          <p className="truncate opacity-80">{message.reply_content}</p>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`relative max-w-[80%] px-3.5 py-2 rounded-2xl text-sm cursor-pointer shadow-sm ${
          isOwn
            ? 'bg-emerald-500 text-white rounded-br-md'
            : 'bg-white dark:bg-white/10 text-amz-terra dark:text-white rounded-bl-md border border-amz-areia-dark/40 dark:border-white/10'
        }`}
        onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
      >
        {/* Image/GIF attachment */}
        {message.attachments?.map((att) =>
          att.type === 'image' || att.type === 'gif' ? (
            <img
              key={att.id}
              src={att.url}
              alt=""
              className="rounded-lg max-w-full mb-1 max-h-60 object-cover"
            />
          ) : att.type === 'video' ? (
            <video
              key={att.id}
              src={att.url}
              controls
              className="rounded-lg max-w-full mb-1 max-h-60"
            />
          ) : att.type === 'audio' ? (
            <audio key={att.id} src={att.url} controls className="w-full mb-1" />
          ) : null
        )}

        {/* Text content */}
        {message.content && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {/* Time + pin */}
        <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? 'justify-end' : ''}`}>
          {message.is_pinned && (
            <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
            </svg>
          )}
          <span className={`text-[10px] ${isOwn ? 'text-emerald-100' : 'text-amz-terra-light/70 dark:text-white/40'}`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Quick reactions popup */}
        {showEmojiPicker === message.id && (
          <div
            className={`absolute ${isOwn ? 'right-0' : 'left-0'} bottom-full mb-2 bg-white dark:bg-[#162f37] rounded-full shadow-xl border border-amz-areia-dark/40 dark:border-white/10 px-2 py-1.5 flex gap-1 z-50`}
            onClick={(e) => e.stopPropagation()}
          >
            {quickReactions.map((r) => (
              <button
                key={r}
                onClick={() => onReact(r)}
                className="text-lg hover:scale-125 transition-transform px-1"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reactions display */}
      {reactionEntries.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          {reactionEntries.map(([reaction, count]) => (
            <button
              key={reaction}
              onClick={() => onReact(reaction)}
              className="flex items-center gap-0.5 bg-amz-areia dark:bg-white/10 rounded-full px-2 py-0.5 text-xs hover:bg-amz-areia-dark dark:hover:bg-white/15 transition-colors"
            >
              <span>{reaction}</span>
              {count > 1 && <span className="text-amz-terra-light dark:text-white/50">{count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Context menu (long press) */}
      {contextMenu?.messageId === message.id && (
        <div
          className="fixed z-50 bg-white dark:bg-[#162f37] rounded-xl shadow-xl border border-amz-areia-dark/40 dark:border-white/10 py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y - 80 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { onReply(); setContextMenu(null) }}
            className="w-full text-left px-4 py-2 text-sm text-amz-terra dark:text-white/80 hover:bg-amz-areia dark:hover:bg-white/10"
          >
            {t.chatReply || 'Responder'}
          </button>
          {isOwn && (
            <button
              onClick={() => { onDelete(); setContextMenu(null) }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
            >
              {t.chatDelete || 'Apagar'}
            </button>
          )}
          <button
            onClick={() => setContextMenu(null)}
            className="w-full text-left px-4 py-2 text-sm text-amz-terra-light dark:text-white/50 hover:bg-amz-areia dark:hover:bg-white/10"
          >
            {t.chatCancel || 'Cancelar'}
          </button>
        </div>
      )}
    </div>
  )
}
