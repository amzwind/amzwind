export type BookingStatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled'

export interface BookingLike {
  id: string
  status?: string | null
  item_type?: string | null
  created_at?: string | null
  notes?: string | null
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function parseNotes(notes: string | null | undefined): Record<string, unknown> | null {
  if (!notes) return null
  try {
    return JSON.parse(notes) as Record<string, unknown>
  } catch {
    return null
  }
}

function getSearchText(booking: BookingLike): string {
  const notes = parseNotes(booking.notes)
  const titles = Array.isArray(notes?.items)
    ? (notes?.items as Array<Record<string, unknown>>)
        .map((item) => String(item?.title ?? ''))
        .join(' ')
    : ''

  const contact = (notes?.contact as Record<string, unknown> | undefined) ?? null
  const service = [
    String(notes?.service ?? ''),
    String(notes?.service_key ?? ''),
    String(notes?.contact_name ?? ''),
    String(contact?.name ?? ''),
    String(contact?.email ?? ''),
  ].join(' ')

  return [
    booking.item_type ?? '',
    booking.status ?? '',
    titles,
    service,
    String(notes?.message ?? ''),
    String(notes?.preferred_date ?? ''),
  ].join(' ')
}

export function filterBookings<T extends BookingLike>(
  bookings: T[],
  query: string,
  statusFilter: BookingStatusFilter = 'all',
): T[] {
  const normalizedQuery = normalizeText(query)

  return bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || (booking.status ?? '').toLowerCase() === statusFilter
    if (!matchesStatus) return false
    if (!normalizedQuery) return true

    const haystack = normalizeText(getSearchText(booking))
    return haystack.includes(normalizedQuery)
  })
}
