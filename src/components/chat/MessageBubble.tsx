import { type MessageWithMeta } from '../../services/chat'

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
  function handleLongPress(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setContextMenu({ messageId: message.id, x: rect.left, y: rect.top })
  }

  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
          {message.content ?? 'Mensagem apagada'}
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
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
          <span className="font-semibold">{message.reply_sender_name ?? 'Rider'}</span>
          <p className="truncate opacity-80">{message.reply_content}</p>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`relative max-w-[80%] px-3.5 py-2 rounded-2xl text-sm cursor-pointer ${
          isOwn
            ? 'bg-emerald-500 text-white rounded-br-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
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
          <span className={`text-[10px] ${isOwn ? 'text-emerald-100' : 'text-gray-400 dark:text-gray-500'}`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Quick reactions popup */}
        {showEmojiPicker === message.id && (
          <div
            className={`absolute ${isOwn ? 'right-0' : 'left-0'} bottom-full mb-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 px-2 py-1.5 flex gap-1 z-50`}
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
              className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{reaction}</span>
              {count > 1 && <span className="text-gray-500 dark:text-gray-400">{count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Context menu (long press) */}
      {contextMenu?.messageId === message.id && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y - 80 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { onReply(); setContextMenu(null) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Responder
          </button>
          {isOwn && (
            <button
              onClick={() => { onDelete(); setContextMenu(null) }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Apagar
            </button>
          )}
          <button
            onClick={() => setContextMenu(null)}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
