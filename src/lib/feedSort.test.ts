import test from 'node:test'
import assert from 'node:assert/strict'

import { sortFeedPosts, type FeedSortMode } from './feedSort.ts'

test('sortFeedPosts keeps newest items first by default', () => {
  const posts = [
    { id: '1', created_at: '2024-01-01T10:00:00Z', likes_count: 3, comments_count: 1, shares_count: 0 },
    { id: '2', created_at: '2024-01-02T10:00:00Z', likes_count: 2, comments_count: 0, shares_count: 0 },
    { id: '3', created_at: '2024-01-03T10:00:00Z', likes_count: 1, comments_count: 0, shares_count: 0 },
  ]

  assert.deepEqual(sortFeedPosts(posts, 'recent').map((post) => post.id), ['3', '2', '1'])
})

test('sortFeedPosts prioritizes most engaging content in popular mode', () => {
  const posts = [
    { id: '1', created_at: '2024-01-01T10:00:00Z', likes_count: 40, comments_count: 10, shares_count: 2 },
    { id: '2', created_at: '2024-01-02T10:00:00Z', likes_count: 8, comments_count: 12, shares_count: 6 },
    { id: '3', created_at: '2024-01-03T10:00:00Z', likes_count: 15, comments_count: 3, shares_count: 1 },
  ]

  const sorted = sortFeedPosts(posts, 'popular' as FeedSortMode)
  assert.deepEqual(sorted.map((post) => post.id), ['1', '3', '2'])
})
