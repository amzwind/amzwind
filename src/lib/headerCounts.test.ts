import test from 'node:test'
import assert from 'node:assert/strict'

import { getCartBadgeCount, getBadgeDisplayValue } from './headerCounts.ts'

test('getCartBadgeCount sums cart quantities for cart badge', () => {
  assert.equal(getCartBadgeCount([{ quantity: 1 }, { quantity: 3 }]), 4)
  assert.equal(getCartBadgeCount([{ quantity: 0 }, { quantity: 1 }]), 1)
})

test('getBadgeDisplayValue caps at 99 and keeps zero hidden', () => {
  assert.equal(getBadgeDisplayValue(0), 0)
  assert.equal(getBadgeDisplayValue(12), 12)
  assert.equal(getBadgeDisplayValue(150), 99)
})
