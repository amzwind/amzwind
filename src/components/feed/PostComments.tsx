import { useState, useEffect } from 'react'
import { loadComments, addComment, deleteComment, type PostComment, type PostAuthor } from '../../services/feed'

interface PostCommentsProps {
  postId: string
  currentUserId: string
}

export default function PostComments({ postId, currentUserId }: PostCommentsProps) {
  const [comments, setComments] = useState<(PostComment & { author: PostAuthor })[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments(postId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [postId])

  async function handleSubmit() {
    if (!newComment.trim() || submitting) return
    setSubmitting(true)
    try {
      const comment = await addComment(postId, currentUserId, newComment)
      const author = { full_name: null, avatar_url: null }
      setComments((prev) => [...prev, { ...comment, author }])
      setNewComment('')
    } catch {
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await deleteComment(commentId, currentUserId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
    }
  }

  if (loading) {
    return <div className="text-xs text-amz-terra-light dark:text-amz-areia/40 py-2">Carregando...</div>
  }

  return (
    <div className="space-y-3">
      {comments.length === 0 ? (
        <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 italic">Nenhum comentário ainda.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 group">
              <div className="w-7 h-7 rounded-full bg-amz-terra/10 dark:bg-amz-terra/20 flex items-center justify-center shrink-0">
                {c.author?.avatar_url ? (
                  <img src={c.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold text-amz-terra">{(c.author?.full_name || 'R')[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{c.author?.full_name || 'Rider'}</p>
                <p className="text-xs text-amz-terra-light dark:text-amz-areia/50 break-words">{c.content}</p>
              </div>
              {c.user_id === currentUserId && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Escreva um comentário..."
          className="flex-1 px-3 py-2 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="px-4 py-2 rounded-xl bg-amz-oceano text-white text-sm font-semibold hover:bg-amz-oceano/90 transition-colors disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
