import test from 'node:test'
import assert from 'node:assert/strict'

import { summarizeTrips } from './tripSummary.ts'

test('summarizeTrips counts upcoming trips and the next trip from the current user list', () => {
  const now = new Date('2026-09-13T12:00:00Z')

  const trips = [
    { id: '1', title: 'Trip do Dia 1', start_date: '2026-09-15T12:00:00Z', status: 'published', participant_count: 8 },
    { id: '2', title: 'Trip do Dia 2', start_date: '2026-09-10T12:00:00Z', status: 'published', participant_count: 5 },
    { id: '3', title: 'Trip cancelada', start_date: '2026-09-20T12:00:00Z', status: 'cancelled', participant_count: 2 },
    { id: '4', title: 'Trip antiga', start_date: '2026-09-05T12:00:00Z', status: 'completed', participant_count: 10 },
  ]

  const summary = summarizeTrips(trips, now)

  assert.equal(summary.totalTrips, 2)
  assert.equal(summary.upcomingTrips, 1)
  assert.equal(summary.nextTrip?.id, '1')
  assert.equal(summary.totalParticipants, 13)
})
