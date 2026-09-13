import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { sharePost } from '../../services/community'
import { getUserConversations, type ConversationPreview } from '../../services/chat'

interface ShareDialogProps {
  postId: string
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ShareDialog({ postId, open, onClose, onSuccess }: ShareDialogProps) {
  const { t } = useLanguage()
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    setConversations([])
    getUserConversations()
      .then(setConversations)
      .catch(() => setError(t.adminError))
      .finally(() => setLoading(false))
  }, [open, t.adminError])

  if (!open) return null

  async function handleShare(conversationId: string) {
    setSharing(conversationId)
    setError(null)
    try {
      await sharePost(postId, conversationId)
      setSuccess(true)
      onSuccess?.()
      setTimeout(onClose, 1200)
    } catch (e: any) {
      setError(e.message || t.adminError)
    } finally {
      setSharing(null)
    }
  }

  function getConversationLabel(c: ConversationPreview): string {
    if (c.type === 'direct') return c.name || t.shareRiderFallback
    if (c.type === 'group') return c.name || t.shareGroupFallback
    if (c.type === 'trip') return c.name || t.shareTripFallback
    return c.name || t.shareConvFallback
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl border border-amz-areia-dark/20 dark:border-white/10 shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="font-semibold text-amz-terra dark:text-amz-areia text-base">
            {t.chatSendMessage}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-amz-dourado/30 border-t-amz-dourado rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mt-2">
              {error}
            </div>
          )}

          {!loading && success && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl px-4 py-3 mt-2 text-center">
              {t.shareSent}
            </div>
          )}

          {!loading && !success && conversations.length === 0 && (
            <p className="text-sm text-amz-terra-light dark:text-amz-areia/40 text-center py-6">
              {t.chatNoConversations}
            </p>
          )}

          {!loading && !success && conversations.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {conversations.map((c) => (
                <button
                  key={c.conversation_id}
                  onClick={() => handleShare(c.conversation_id)}
                  disabled={sharing !== null}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-amz-oceano/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {c.avatar_url ? (
                      <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5 text-amz-oceano" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-amz-terra dark:text-amz-areia truncate">
                      {getConversationLabel(c)}
                    </p>
                    {c.last_message && (
                      <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 truncate">
                        {c.last_message}
                      </p>
                    )}
                  </div>
                  {sharing === c.conversation_id && (
                    <div className="w-5 h-5 border-2 border-amz-dourado/30 border-t-amz-dourado rounded-full animate-spin shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
