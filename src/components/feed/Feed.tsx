import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { loadFeed, loadFriendsFeed, type PostFeedItem, type PostAuthor } from '../../services/feed'
import { supabase } from '../../services/supabase'
import { sortFeedPosts, type FeedSortMode } from '../../lib/feedSort'
import PostCard from './PostCard'
import CreatePost from './CreatePost'

type FeedFilter = 'global' | 'friends'

interface FeedProps {
  currentUserId: string
  currentUserName: string | null
  currentUserAvatar: string | null
}

export default function Feed({ currentUserId, currentUserName, currentUserAvatar }: FeedProps) {
  const { t } = useLanguage()
  const [posts, setPosts] = useState<PostFeedItem[]>([])
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('global')
  const [sortMode, setSortMode] = useState<FeedSortMode>('recent')
  const instanceId = useRef(Math.random().toString(36).slice(2))
  const PAGE_SIZE = 20

  const fetchPosts = useCallback(async (currentOffset: number, filter: FeedFilter) => {
    try {
      const loader = filter === 'friends' ? loadFriendsFeed : loadFeed
      const result = await loader(PAGE_SIZE, currentOffset)
      if (currentOffset === 0) {
        setPosts(result.posts)
        setAuthors(result.authors)
      } else {
        setPosts((prev) => [...prev, ...result.posts])
        setAuthors((prev) => ({ ...prev, ...result.authors }))
      }
      setHasMore(result.posts.length === PAGE_SIZE)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.feedErrorLoading)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(0, feedFilter)
  }, [fetchPosts, feedFilter])

  useEffect(() => {
    if (loading) return

    const channel = supabase
      .channel(`feed-realtime-${instanceId.current}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        async (payload) => {
          const newPost = payload.new as PostFeedItem
          if (newPost.user_id === currentUserId) return
          if (posts.some((p) => p.id === newPost.id)) return

          if (feedFilter === 'friends') {
            try {
              const { data: friendship } = await supabase
                .from('friendships')
                .select('id')
                .or(`and(user_id.eq.${currentUserId},friend_id.eq.${newPost.user_id}),and(user_id.eq.${newPost.user_id},friend_id.eq.${currentUserId})`)
                .limit(1)
                .maybeSingle()
              if (!friendship) return
            } catch {
              return
            }
          }

          setPosts((prev) => [{ ...newPost, liked_by_me: false } as PostFeedItem, ...prev])

          if (!authors[newPost.user_id]) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', newPost.user_id)
              .single()
            if (profile) {
              setAuthors((prev) => ({
                ...prev,
                [newPost.user_id]: { full_name: profile.full_name, avatar_url: profile.avatar_url },
              }))
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          const updated = payload.new as PostFeedItem
          setPosts((prev) => prev.map((p) =>
            p.id === updated.id ? { ...p, content: updated.content, updated_at: updated.updated_at } : p
          ))
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts' },
        (payload) => {
          const deleted = payload.old as { id: string }
          setPosts((prev) => prev.filter((p) => p.id !== deleted.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loading, currentUserId, feedFilter, authors, posts])

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

  function handleUpdate(postId: string, newContent: string) {
    setPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, content: newContent } : p
    ))
  }

  function handleFilterChange(filter: FeedFilter) {
    if (filter === feedFilter) return
    setFeedFilter(filter)
    setPosts([])
    setAuthors({})
    setOffset(0)
    setHasMore(true)
    setLoading(true)
  }

  const visiblePosts = sortFeedPosts(posts, sortMode)

  function loadMore() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextOffset = offset + PAGE_SIZE
    setOffset(nextOffset)
    fetchPosts(nextOffset, feedFilter)
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
        userName={currentUserName}
        avatarUrl={currentUserAvatar}
        onPostCreated={handlePostCreated}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-1 bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-1">
          <button
            onClick={() => handleFilterChange('global')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              feedFilter === 'global'
                ? 'bg-amz-oceano text-white'
                : 'text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            {t.feedGlobal}
          </button>
          <button
            onClick={() => handleFilterChange('friends')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              feedFilter === 'friends'
                ? 'bg-amz-oceano text-white'
                : 'text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            {t.feedFriends}
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-white/5 rounded-xl border border-amz-areia-dark/20 dark:border-white/5 p-1">
          {(['recent', 'popular'] as FeedSortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                sortMode === mode
                  ? 'bg-amz-dourado text-white'
                  : 'text-amz-terra-light dark:text-amz-areia/40 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {mode === 'recent' ? 'Recentes' : 'Populares'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => { setError(''); fetchPosts(0, feedFilter) }} className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600 underline">
            {t.feedRetry}
          </button>
        </div>
      )}

      {posts.length === 0 && !error ? (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-12 text-center border border-amz-areia-dark/20 dark:border-white/5">
          <div className="text-4xl mb-3">🏄</div>
          <p className="text-amz-terra-light dark:text-amz-areia/40 mb-1">{t.feedEmpty}</p>
          <p className="text-xs text-amz-terra-light dark:text-amz-areia/30">{t.feedEmptyHint}</p>
        </div>
      ) : (
        <>
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={authors[post.user_id]}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3 rounded-xl text-sm font-semibold text-amz-oceano hover:bg-amz-oceano/10 transition-colors disabled:opacity-40"
            >
              {loadingMore ? t.feedLoading : t.feedLoadMore}
            </button>
          )}
        </>
      )}
    </div>
  )
}
