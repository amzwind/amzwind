export type FeedSortMode = 'recent' | 'popular'

export type FeedSortablePost = {
  id: string
  created_at: string
  likes_count?: number | null
  comments_count?: number | null
  shares_count?: number | null
}

export function sortFeedPosts<T extends FeedSortablePost>(posts: T[], mode: FeedSortMode): T[] {
  return [...posts].sort((left, right) => {
    if (mode === 'popular') {
      const leftScore = (left.likes_count ?? 0) * 3 + (left.comments_count ?? 0) + (left.shares_count ?? 0)
      const rightScore = (right.likes_count ?? 0) * 3 + (right.comments_count ?? 0) + (right.shares_count ?? 0)

      if (rightScore !== leftScore) return rightScore - leftScore
    }

    const leftDate = new Date(left.created_at).getTime()
    const rightDate = new Date(right.created_at).getTime()
    return rightDate - leftDate
  })
}
