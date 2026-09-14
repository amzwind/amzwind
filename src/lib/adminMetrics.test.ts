import test from 'node:test'
import assert from 'node:assert/strict'

import { buildFinancialOverview, buildBookingOverview, buildSalesPerformanceOverview } from './adminMetrics.ts'

test('buildFinancialOverview sums open and paid movements correctly', () => {
  const snapshot = buildFinancialOverview([
    { account_type: 'receivable', status: 'pending', amount: 2000 },
    { account_type: 'receivable', status: 'paid', amount: 300 },
    { account_type: 'payable', status: 'pending', amount: 1200 },
    { account_type: 'payable', status: 'paid', amount: 500 },
    { account_type: 'payable', status: 'overdue', amount: 300 },
  ])

  assert.deepEqual(snapshot, {
    receivable: 2000,
    payable: 1500,
    paidReceivable: 300,
    paidPayable: 500,
    balance: 500,
  })
})

test('buildBookingOverview keeps the latest bookings and counts status', () => {
  const summary = buildBookingOverview([
    { id: '1', status: 'confirmed', booking_date: '2026-09-10', created_at: '2026-09-10T10:00:00Z' },
    { id: '2', status: 'pending', booking_date: '2026-09-11', created_at: '2026-09-11T09:00:00Z' },
    { id: '3', status: 'cancelled', booking_date: '2026-09-12', created_at: '2026-09-12T08:00:00Z' },
    { id: '4', status: 'pending', booking_date: '2026-09-13', created_at: '2026-09-13T07:00:00Z' },
  ])

  assert.equal(summary.total, 4)
  assert.equal(summary.confirmed, 1)
  assert.equal(summary.pending, 2)
  assert.equal(summary.cancelled, 1)
  assert.deepEqual(summary.recent.map((booking) => booking.id), ['4', '3', '2', '1'])
})

test('buildSalesPerformanceOverview groups revenue by category and month', () => {
  const overview = buildSalesPerformanceOverview([
    { account_type: 'receivable', status: 'paid', amount: 3000, category: 'Receita Expedições', due_date: '2026-08-10' },
    { account_type: 'receivable', status: 'pending', amount: 2000, category: 'Receita Expedições', due_date: '2026-09-12' },
    { account_type: 'receivable', status: 'paid', amount: 1200, category: 'Receita Aulas', due_date: '2026-09-02' },
    { account_type: 'receivable', status: 'pending', amount: 2500, category: 'Receita Produtos', due_date: '2026-10-17' },
  ])

  assert.equal(overview.totalRevenue, 8700)
  assert.deepEqual(overview.topCategories.map((item) => item.category), ['Receita Expedições', 'Receita Produtos', 'Receita Aulas'])
  assert.equal(overview.monthlyTrend.length, 3)
  assert.equal(overview.monthlyTrend[0].month, 'Ago 2026')
  assert.ok(overview.monthlyTrend[0].revenue >= 0)
})
