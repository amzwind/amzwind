import { useState } from 'react'
import { toggleLike, deletePost, type PostFeedItem, type PostAuthor } from '../../services/feed'
import PostComments from './PostComments'

interface PostCardProps {
  post: PostFeedItem
  author: PostAuthor | undefined
  currentUserId: string
  onDelete: (postId: string) => void
}

function getTimeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'agora'
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

export default function PostCard({ post, author, currentUserId, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwn = post.user_id === currentUserId
  const displayName = author?.full_name || 'Rider'

  async function handleLike() {
    try {
      const nowLiked = await toggleLike(post.id)
      setLiked(nowLiked)
      setLikesCount((prev) => nowLiked ? prev + 1 : Math.max(0, prev - 1))
    } catch {
    }
  }

  async function handleDelete() {
    if (!window.confirm('Excluir esta publicação?') || deleting) return
    setDeleting(true)
    try {
      await deletePost(post.id, currentUserId)
      onDelete(post.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amz-oceano/10 flex items-center justify-center shrink-0">
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-amz-oceano">{getInitials(displayName)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amz-terra dark:text-amz-areia text-sm truncate">{displayName}</p>
            <p className="text-[11px] text-amz-terra-light dark:text-amz-areia/40">{getTimeAgo(post.created_at)}</p>
          </div>
          {isOwn && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>

        {post.content && (
          <p className="text-sm text-amz-terra dark:text-amz-areia whitespace-pre-wrap mb-3">{post.content}</p>
        )}

        {post.media_url && (
          <div className="mb-3 rounded-xl overflow-hidden">
            {isVideoUrl(post.media_url) ? (
              <video src={post.media_url} controls preload="metadata" className="w-full max-h-80 object-cover" />
            ) : (
              <img src={post.media_url} alt="" className="w-full max-h-80 object-cover" loading="lazy" />
            )}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-amz-areia-dark/10 dark:border-white/5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked
                ? 'text-red-500'
                : 'text-amz-terra-light dark:text-amz-areia/40 hover:text-red-400'
            }`}
          >
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-amz-terra-light dark:text-amz-areia/40 hover:text-amz-dourado transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            {post.comments_count > 0 && <span>{post.comments_count}</span>}
            <span className="hidden sm:inline">Comentar</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4 border-t border-amz-areia-dark/10 dark:border-white/5 pt-3">
          <PostComments postId={post.id} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  )
}
