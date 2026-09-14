import test from 'node:test'
import assert from 'node:assert/strict'

import { filterWishlistItems, sortWishlistItems, type FavoriteLike } from './wishlistFilters.ts'

test('filterWishlistItems finds by title and type', () => {
  const items: FavoriteLike[] = [
    { id: '1', type: 'experience', title: 'Downwind Bahia', price: 200 },
    { id: '2', type: 'product', title: 'Rashguard Azul', price: 150 },
    { id: '3', type: 'class', title: 'Aula de Kitesurf', price: 320 },
  ]

  assert.deepEqual(filterWishlistItems(items, 'bahia').map((item) => item.id), ['1'])
  assert.deepEqual(filterWishlistItems(items, 'produto').map((item) => item.id), ['2'])
})

test('sortWishlistItems sorts by price descending and keeps type order stable', () => {
  const items: FavoriteLike[] = [
    { id: '1', type: 'experience', title: 'Downwind', price: 200 },
    { id: '2', type: 'class', title: 'Aula', price: 300 },
    { id: '3', type: 'product', title: 'Rashguard', price: 150 },
  ]

  assert.deepEqual(sortWishlistItems(items, 'price-desc').map((item) => item.id), ['2', '1', '3'])
})
