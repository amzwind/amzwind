export type FriendLike = {
  id: string
  full_name?: string | null
}

function normalizePersonName(value: string | null | undefined): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

export function filterPeopleByQuery<T extends FriendLike>(people: T[], query: string): T[] {
  const normalizedQuery = normalizePersonName(query)

  if (!normalizedQuery) return sortPeopleByName(people)

  return sortPeopleByName(people).filter((person) => {
    const fullName = normalizePersonName(person.full_name)
    return fullName.includes(normalizedQuery)
  })
}

export function sortPeopleByName<T extends FriendLike>(people: T[]): T[] {
  return [...people].sort((left, right) => {
    const leftName = normalizePersonName(left.full_name)
    const rightName = normalizePersonName(right.full_name)

    if (!leftName && !rightName) return 0
    if (!leftName) return 1
    if (!rightName) return -1

    return leftName.localeCompare(rightName)
  })
}
