export type TripSummaryItem = {
  id: string
  title?: string | null
  start_date?: string | null
  status?: string | null
  participant_count?: number | null
}

export function summarizeTrips<T extends TripSummaryItem>(trips: T[], now = new Date()) {
  const activeTrips = trips.filter((trip) => trip.status !== 'cancelled' && trip.status !== 'completed')
  const upcomingTrips = activeTrips.filter((trip) => {
    if (!trip.start_date) return false
    const tripDate = new Date(trip.start_date).getTime()
    return tripDate >= now.getTime()
  })

  const nextTrip = [...upcomingTrips].sort((left, right) => {
    const leftDate = new Date(left.start_date ?? 0).getTime()
    const rightDate = new Date(right.start_date ?? 0).getTime()
    return leftDate - rightDate
  })[0] ?? null

  const totalParticipants = activeTrips.reduce((sum, trip) => sum + Number(trip.participant_count ?? 0), 0)

  return {
    totalTrips: activeTrips.length,
    upcomingTrips: upcomingTrips.length,
    nextTrip,
    totalParticipants,
  }
}
