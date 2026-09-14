import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { toggleLike, deletePost, type PostFeedItem, type PostAuthor } from '../../services/feed'
import { updatePost } from '../../services/community'
import PostComments from './PostComments'
import ShareDialog from '../community/ShareDialog'

interface PostCardProps {
  post: PostFeedItem & { shares_count?: number }
  author: PostAuthor | undefined
  currentUserId: string
  onDelete: (postId: string) => void
  onUpdate?: (postId: string, newContent: string) => void
}

function getTimeAgo(dateStr: string, t: Record<string, string>): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return t.feedPostNow
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video')
}

export default function PostCard({ post, author, currentUserId, onDelete, onUpdate }: PostCardProps) {
  const { t } = useLanguage()
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [sharesCount, setSharesCount] = useState(post.shares_count ?? 0)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content || '')
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const isOwn = post.user_id === currentUserId
  const displayName = author?.full_name || t.feedCommentRider
  const isEdited = post.updated_at && post.updated_at !== post.created_at

  async function handleLike() {
    try {
      const nowLiked = await toggleLike(post.id)
      setLiked(nowLiked)
      setLikesCount((prev) => nowLiked ? prev + 1 : Math.max(0, prev - 1))
    } catch {
    }
  }

  async function handleDelete() {
    if (!window.confirm(t.feedPostDeleteConfirm) || deleting) return
    setDeleting(true)
    try {
      await deletePost(post.id)
      onDelete(post.id)
    } catch {
      setDeleting(false)
    }
  }

  async function handleSaveEdit() {
    if (!editContent.trim() || saving) return
    setSaving(true)
    setEditError('')
    try {
      await updatePost(post.id, editContent)
      onUpdate?.(post.id, editContent.trim())
      setEditing(false)
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : t.feedPostErrorSave)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setEditContent(post.content || '')
    setEditing(false)
    setEditError('')
  }

  return (
    <div className="bg-white/85 dark:bg-[#241407]/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-amz-terra/[0.07] overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-amz-terra/10">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amz-oceano/15 to-amz-dourado/20 flex items-center justify-center shrink-0 ring-2 ring-amz-dourado/50 ring-offset-2 ring-offset-white dark:ring-offset-[#241407]">
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-amz-oceano dark:text-amz-dourado">{getInitials(displayName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{displayName}</p>
            <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40">
              {getTimeAgo(post.created_at, t as unknown as Record<string, string>)}
              {isEdited && <span className="ml-1 italic">({t.feedPostEdited})</span>}
            </p>
          </div>
          {isOwn && !editing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(true)}
                aria-label={t.adminEdit}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 rounded-lg text-amz-oceano hover:bg-amz-oceano/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                aria-label={t.adminDelete}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-amz-oceano/30 bg-gray-50 dark:bg-white/5 text-sm text-amz-terra dark:text-white focus:outline-none focus:ring-2 focus:ring-amz-oceano/50 resize-none"
            />
            {editError && <p className="text-xs text-red-500 mt-1">{editError}</p>}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || saving}
                className="px-3 py-1.5 rounded-lg bg-amz-oceano text-white text-xs font-semibold hover:bg-amz-oceano/90 transition-colors disabled:opacity-40"
              >
                {saving ? t.feedPostSaving : t.feedPostSave}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {t.feedCommentCancel}
              </button>
            </div>
          </div>
        ) : (
          <>
            {post.content && (
              <p className="text-[15px] leading-relaxed text-amz-terra dark:text-amz-areia whitespace-pre-wrap mb-3">{post.content}</p>
            )}

            {post.media_url && (
              <div className="mb-3 rounded-2xl overflow-hidden ring-1 ring-amz-terra/10 dark:ring-white/10 shadow-md">
                {isVideoUrl(post.media_url) ? (
                  <video src={post.media_url} controls preload="metadata" className="w-full max-h-80 object-cover" />
                ) : (
                  <img src={post.media_url} alt="" className="w-full max-h-80 object-cover" loading="lazy" />
                )}
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-amz-terra/10 dark:border-white/10">
          <button
            onClick={handleLike}
            aria-pressed={liked}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-125 ${
              liked
                ? 'text-white bg-gradient-to-r from-rose-500 to-red-500 shadow-md shadow-red-500/30'
                : 'text-amz-terra-light dark:text-amz-areia/50 bg-amz-terra/5 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500'
            }`}
          >
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            aria-label={t.feedPostComment}
            aria-expanded={showComments}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              showComments
                ? 'text-white bg-gradient-to-r from-amz-dourado to-amber-500 shadow-md shadow-amz-dourado/30'
                : 'text-amz-terra-light dark:text-amz-areia/50 bg-amz-terra/5 dark:bg-white/5 hover:bg-amz-dourado/15 hover:text-amz-dourado'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {post.comments_count > 0 && <span className="tabular-nums">{post.comments_count}</span>}
            <span className="hidden sm:inline text-xs">{t.feedPostComment}</span>
          </button>
          <button
            onClick={() => setShowShareDialog(true)}
            aria-label={t.feedPostShare}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-amz-terra-light dark:text-amz-areia/50 bg-amz-terra/5 dark:bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v13" /></svg>
            {sharesCount > 0 && <span className="tabular-nums">{sharesCount}</span>}
            <span className="hidden sm:inline text-xs">{t.feedPostShare}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mx-4 mb-4 rounded-2xl bg-amz-areia/50 dark:bg-white/[0.04] border border-amz-terra/10 dark:border-white/10 px-4 pb-4 pt-3">
          <PostComments postId={post.id} currentUserId={currentUserId} />
        </div>
      )}

      <ShareDialog
        postId={post.id}
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onSuccess={() => setSharesCount((prev) => prev + 1)}
      />
    </div>
  )
}
