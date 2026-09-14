export type TripSortMode = 'upcoming' | 'recent' | 'popular'

export type TripSortable = {
  id: string
  start_date?: string | null
  created_at?: string | null
  participant_count?: number | null
}

export function sortTrips<T extends TripSortable>(trips: T[], mode: TripSortMode): T[] {
  return [...trips].sort((left, right) => {
    if (mode === 'popular') {
      const leftPopularity = Number(left.participant_count ?? 0)
      const rightPopularity = Number(right.participant_count ?? 0)
      if (rightPopularity !== leftPopularity) {
        return rightPopularity - leftPopularity
      }
    }

    if (mode === 'upcoming') {
      const leftDate = new Date(left.start_date ?? left.created_at ?? 0).getTime()
      const rightDate = new Date(right.start_date ?? right.created_at ?? 0).getTime()
      if (leftDate !== rightDate) return leftDate - rightDate
    }

    const leftCreated = new Date(left.created_at ?? left.start_date ?? 0).getTime()
    const rightCreated = new Date(right.created_at ?? right.start_date ?? 0).getTime()
    return rightCreated - leftCreated
  })
}
