export interface FeedSearchItem {
  id: string
  user_id: string
  content?: string | null
  created_at?: string
  likes_count?: number | null
}

export type FeedSearchAuthors = Record<string, { full_name?: string | null }>

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function filterFeedPosts<T extends FeedSearchItem>(
  posts: T[],
  query: string,
  authors: FeedSearchAuthors = {},
): T[] {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) return posts

  return posts.filter((post) => {
    const authorName = authors[post.user_id]?.full_name ?? ''
    const haystack = normalizeText([
      post.content ?? '',
      authorName,
    ].join(' '))

    return haystack.includes(normalizedQuery)
  })
}
