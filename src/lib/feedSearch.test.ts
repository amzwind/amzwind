import test from 'node:test'
import assert from 'node:assert/strict'

import { filterFeedPosts, type FeedSearchItem } from './feedSearch.ts'

const items: FeedSearchItem[] = [
  {
    id: '1',
    user_id: 'a1',
    content: 'Vamos para a praia de Búzios no fim de semana',
    created_at: '2026-09-10T12:00:00.000Z',
    likes_count: 2,
  },
  {
    id: '2',
    user_id: 'a2',
    content: 'Aula de kite inaugurada hoje',
    created_at: '2026-09-11T12:00:00.000Z',
    likes_count: 5,
  },
]

test('filterFeedPosts matches content and author names ignoring accents and case', () => {
  assert.deepEqual(filterFeedPosts(items, 'buzios', { a1: { full_name: 'Maria Souza' } }).map((item) => item.id), ['1'])
  assert.deepEqual(filterFeedPosts(items, 'maria', { a1: { full_name: 'Maria Souza' } }).map((item) => item.id), ['1'])
  assert.deepEqual(filterFeedPosts(items, 'kite', { a2: { full_name: 'João' } }).map((item) => item.id), ['2'])
})

test('filterFeedPosts keeps all posts when query is empty', () => {
  assert.equal(filterFeedPosts(items, '   ', {}).length, 2)
})
