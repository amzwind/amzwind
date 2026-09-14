export type FavoriteLike = {
  id: string
  type: 'experience' | 'product' | 'class'
  title: string
  price: number
}

export type WishlistSortMode = 'recent' | 'price-desc' | 'price-asc'

const typeLabels: Record<FavoriteLike['type'], string> = {
  experience: 'experiencia',
  product: 'produto',
  class: 'aula',
}

export function filterWishlistItems<T extends FavoriteLike>(items: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return items

  return items.filter((item) => {
    const haystack = [item.title, typeLabels[item.type]].join(' ').toLowerCase()
    return haystack.includes(normalized)
  })
}

export function sortWishlistItems<T extends FavoriteLike>(items: T[], mode: WishlistSortMode): T[] {
  const ordered = [...items]

  ordered.sort((left, right) => {
    if (mode === 'price-asc') return left.price - right.price
    if (mode === 'price-desc') return right.price - left.price
    return 0
  })

  return ordered
}
