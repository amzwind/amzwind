import { useState, useEffect, useCallback } from 'react'
import { loadFeed, type PostFeedItem, type PostAuthor } from '../../services/feed'
import PostCard from './PostCard'
import CreatePost from './CreatePost'

interface FeedProps {
  currentUserId: string
  currentUserName: string | null
  currentUserAvatar: string | null
}

export default function Feed({ currentUserId, currentUserName, currentUserAvatar }: FeedProps) {
  const [posts, setPosts] = useState<PostFeedItem[]>([])
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 20

  const fetchPosts = useCallback(async (currentOffset: number) => {
    try {
      const result = await loadFeed(PAGE_SIZE, currentOffset)
      if (currentOffset === 0) {
        setPosts(result.posts)
        setAuthors(result.authors)
      } else {
        setPosts((prev) => [...prev, ...result.posts])
        setAuthors((prev) => ({ ...prev, ...result.authors }))
      }
      setHasMore(result.posts.length === PAGE_SIZE)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar feed.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(0)
  }, [fetchPosts])

  function handlePostCreated(post: PostFeedItem) {
    setPosts((prev) => [post, ...prev])
    setAuthors((prev) => ({
      ...prev,
      [currentUserId]: { full_name: currentUserName, avatar_url: currentUserAvatar },
    }))
  }

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  function loadMore() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextOffset = offset + PAGE_SIZE
    setOffset(nextOffset)
    fetchPosts(nextOffset)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-amz-areia-dark/20 dark:border-white/5 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amz-areia dark:bg-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-amz-areia dark:bg-white/10 rounded w-24" />
                <div className="h-2 bg-amz-areia dark:bg-white/10 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-amz-areia dark:bg-white/10 rounded w-full" />
              <div className="h-3 bg-amz-areia dark:bg-white/10 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CreatePost
        userId={currentUserId}
        userName={currentUserName}
        avatarUrl={currentUserAvatar}
        onPostCreated={handlePostCreated}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => { setError(''); fetchPosts(0) }} className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600 underline">
            Tentar novamente
          </button>
        </div>
      )}

      {posts.length === 0 && !error ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
          <div className="text-4xl mb-3">🏄</div>
          <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">Nenhuma publicação ainda</p>
          <p className="text-xs text-amz-terra-light dark:text-amz-areia/30">Seja o primeiro a compartilhar uma session!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={authors[post.user_id]}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3 rounded-xl text-sm font-semibold text-amz-oceano hover:bg-amz-oceano/10 transition-colors disabled:opacity-40"
            >
              {loadingMore ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
