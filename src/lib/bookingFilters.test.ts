import test from 'node:test'
import assert from 'node:assert/strict'

import { filterBookings, type BookingLike, type BookingStatusFilter } from './bookingFilters.ts'

const bookings: BookingLike[] = [
  {
    id: '1',
    item_type: 'experience',
    status: 'confirmed',
    created_at: '2026-09-01T10:00:00.000Z',
    notes: JSON.stringify({
      items: [{ title: 'Pousada na Ilha', price: 250, quantity: 2 }],
      service: 'Traslado exclusivo',
    }),
  },
  {
    id: '2',
    item_type: 'product',
    status: 'pending',
    created_at: '2026-08-15T10:00:00.000Z',
    notes: JSON.stringify({
      items: [{ title: 'Kiteboard Aero', price: 1400, quantity: 1 }],
      contact_name: 'João Silva',
    }),
  },
  {
    id: '3',
    item_type: 'class',
    status: 'cancelled',
    created_at: '2026-07-10T10:00:00.000Z',
    notes: JSON.stringify({
      service: 'Aula de nível iniciante',
    }),
  },
]

test('filterBookings searches by searchable fields and status', () => {
  assert.deepEqual(filterBookings(bookings, 'joão', 'all').map((item) => item.id), ['2'])
  assert.deepEqual(filterBookings(bookings, 'ilha', 'all').map((item) => item.id), ['1'])
  assert.deepEqual(filterBookings(bookings, '', 'pending').map((item) => item.id), ['2'])
})

test('filterBookings handles empty or normalized queries', () => {
  const allConfirmed = filterBookings(bookings, '   ', 'confirmed')
  assert.equal(allConfirmed.length, 1)
  assert.equal(allConfirmed[0].id, '1')

  const byType = filterBookings(bookings, 'aula', 'all' as BookingStatusFilter)
  assert.deepEqual(byType.map((item) => item.id), ['3'])
})
