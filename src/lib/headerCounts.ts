export interface HeaderCartItemLike {
  quantity?: number | null
}

export function getCartBadgeCount(items: HeaderCartItemLike[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity ?? 0)), 0)
}

export function getBadgeDisplayValue(value: number): number {
  if (value <= 0) return 0
  return Math.min(value, 99)
}
