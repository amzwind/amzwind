import test from 'node:test'
import assert from 'node:assert/strict'

import { sortTrips, type TripSortMode } from './tripSort.ts'

test('sortTrips prioritizes upcoming trips first', () => {
  const trips = [
    { id: '1', start_date: '2024-01-05T00:00:00Z', created_at: '2024-01-01T00:00:00Z', participant_count: 2 },
    { id: '2', start_date: '2024-01-02T00:00:00Z', created_at: '2024-01-04T00:00:00Z', participant_count: 8 },
    { id: '3', start_date: '2024-01-10T00:00:00Z', created_at: '2024-01-02T00:00:00Z', participant_count: 5 },
  ]

  assert.deepEqual(sortTrips(trips, 'upcoming').map((trip) => trip.id), ['2', '1', '3'])
})

test('sortTrips falls back to recent trips when requested', () => {
  const trips = [
    { id: '1', start_date: '2024-01-10T00:00:00Z', created_at: '2024-01-01T00:00:00Z', participant_count: 1 },
    { id: '2', start_date: '2024-01-03T00:00:00Z', created_at: '2024-01-04T00:00:00Z', participant_count: 9 },
    { id: '3', start_date: '2024-01-05T00:00:00Z', created_at: '2024-01-02T00:00:00Z', participant_count: 4 },
  ]

  const sorted = sortTrips(trips, 'recent' as TripSortMode)
  assert.deepEqual(sorted.map((trip) => trip.id), ['2', '3', '1'])
})
