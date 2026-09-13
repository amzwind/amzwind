import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { loadComments, addComment, deleteComment, updateComment, type PostComment, type PostAuthor } from '../../services/feed'

interface PostCommentsProps {
  postId: string
  currentUserId: string
}

export default function PostComments({ postId, currentUserId }: PostCommentsProps) {
  const { t } = useLanguage()
  const [comments, setComments] = useState<(PostComment & { author: PostAuthor })[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

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
      const comment = await addComment(postId, newComment)
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
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
    }
  }

  function startEdit(comment: PostComment & { author: PostAuthor }) {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent('')
  }

  async function handleSaveEdit(commentId: string) {
    if (!editContent.trim() || savingEdit) return
    setSavingEdit(true)
    try {
      await updateComment(commentId, editContent)
      setComments((prev) => prev.map((c) =>
        c.id === commentId ? { ...c, content: editContent.trim() } : c
      ))
      setEditingId(null)
      setEditContent('')
    } catch {
    } finally {
      setSavingEdit(false)
    }
  }

  if (loading) {
    return <div className="text-xs text-amz-terra-light dark:text-amz-areia/40 py-2">{t.feedCommentLoading}</div>
  }

  return (
    <div className="space-y-3">
      {comments.length === 0 ? (
        <p className="text-xs text-amz-terra-light dark:text-amz-areia/40 italic">{t.feedCommentEmpty}</p>
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
                <p className="text-xs font-semibold text-amz-terra dark:text-amz-areia">{c.author?.full_name || t.feedCommentRider}</p>
                {editingId === c.id ? (
                  <div className="mt-1">
                    <input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(c.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="w-full px-2 py-1 rounded-lg border border-amz-oceano/30 bg-gray-50 dark:bg-white/5 text-xs text-amz-terra dark:text-white focus:outline-none focus:ring-1 focus:ring-amz-oceano/50"
                      autoFocus
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        disabled={!editContent.trim() || savingEdit}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amz-oceano text-white hover:bg-amz-oceano/90 disabled:opacity-40"
                      >
                        {savingEdit ? '...' : t.feedCommentSave}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingEdit}
                        className="px-2 py-0.5 rounded text-[10px] text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5"
                      >
                        {t.feedCommentCancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amz-terra-light dark:text-amz-areia/50 break-words">{c.content}</p>
                )}
              </div>
              {c.user_id === currentUserId && editingId !== c.id && (
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-1 rounded text-amz-oceano hover:bg-amz-oceano/10 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
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
          placeholder={t.feedCommentPlaceholder}
          className="flex-1 px-3 py-2 rounded-xl border border-amz-areia-dark/20 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          className="px-4 py-2 rounded-xl bg-amz-oceano text-white text-sm font-semibold hover:bg-amz-oceano/90 transition-colors disabled:opacity-40"
        >
          {t.feedCommentSend}
        </button>
      </div>
    </div>
  )
}
