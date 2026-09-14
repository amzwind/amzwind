export type AccountType = 'payable' | 'receivable'
export type AccountStatus = 'pending' | 'paid' | 'overdue'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface FinancialAccountLike {
  account_type: AccountType
  status: AccountStatus
  amount: number
}

export interface BookingLike {
  id: string
  status: BookingStatus
  booking_date: string
  created_at?: string
}

export interface SalesCategoryPoint {
  category: string
  total: number
  share: number
}

export interface SalesMonthlyPoint {
  month: string
  revenue: number
  delta: number
}

export interface SalesPerformanceOverview {
  totalRevenue: number
  topCategories: SalesCategoryPoint[]
  monthlyTrend: SalesMonthlyPoint[]
}

export function buildFinancialOverview(accounts: FinancialAccountLike[]) {
  const receivable = accounts
    .filter((account) => account.account_type === 'receivable' && account.status !== 'paid')
    .reduce((total, account) => total + Number(account.amount || 0), 0)

  const payable = accounts
    .filter((account) => account.account_type === 'payable' && account.status !== 'paid')
    .reduce((total, account) => total + Number(account.amount || 0), 0)

  const paidReceivable = accounts
    .filter((account) => account.account_type === 'receivable' && account.status === 'paid')
    .reduce((total, account) => total + Number(account.amount || 0), 0)

  const paidPayable = accounts
    .filter((account) => account.account_type === 'payable' && account.status === 'paid')
    .reduce((total, account) => total + Number(account.amount || 0), 0)

  return {
    receivable,
    payable,
    paidReceivable,
    paidPayable,
    balance: receivable - payable,
  }
}

export function buildBookingOverview(bookings: BookingLike[]) {
  const ordered = [...bookings].sort((left, right) => {
    const leftTime = new Date(left.created_at || left.booking_date).getTime()
    const rightTime = new Date(right.created_at || right.booking_date).getTime()
    return rightTime - leftTime
  })

  const recent = ordered.slice(0, 5)

  return {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
    recent,
  }
}

export function buildSalesPerformanceOverview(
  accounts: Array<FinancialAccountLike & { category?: string | null; due_date?: string }> = [],
): SalesPerformanceOverview {
  const receivables = accounts.filter((account) => account.account_type === 'receivable')
  const totalRevenue = receivables.reduce((total, account) => total + Number(account.amount || 0), 0)

  const categoryTotals = receivables.reduce<Record<string, number>>((accumulator, account) => {
    const category = account.category || 'Outros'
    accumulator[category] = (accumulator[category] || 0) + Number(account.amount || 0)
    return accumulator
  }, {})

  const topCategories: SalesCategoryPoint[] = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      share: totalRevenue > 0 ? total / totalRevenue : 0,
    }))
    .sort((left, right) => right.total - left.total)
    .slice(0, 3)

  const months = new Map<string, number>()
  receivables.forEach((account) => {
    if (!account.due_date) return
    const date = new Date(account.due_date)
    if (Number.isNaN(date.getTime())) return

    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    const current = months.get(monthKey) || 0
    months.set(monthKey, current + Number(account.amount || 0))
  })

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const sortedMonthKeys = Array.from(months.keys()).sort()
  const recentMonths = sortedMonthKeys.slice(-3)
  const monthlyTrend: SalesMonthlyPoint[] = recentMonths.map((monthKey, index) => {
    const [year, month] = monthKey.split('-').map(Number)
    const monthLabel = `${monthNames[month - 1]} ${year}`
    const revenue = months.get(monthKey) || 0
    const previousRevenue = index === 0 ? 0 : (months.get(recentMonths[index - 1]) || 0)
    return {
      month: monthLabel,
      revenue,
      delta: index === 0 ? 0 : revenue - previousRevenue,
    }
  })

  return {
    totalRevenue,
    topCategories,
    monthlyTrend,
  }
}
