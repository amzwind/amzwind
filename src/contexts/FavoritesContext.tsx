import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type FavoriteItemType = 'experience' | 'product' | 'class'

export interface FavoriteItem {
  id: string
  type: FavoriteItemType
  title: string
  price: number
  image_url?: string | null
  addedAt: number
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
  isFavorite: (id: string, type: FavoriteItemType) => boolean
  removeFavorite: (id: string, type: FavoriteItemType) => void
  getFavoritesCount: () => number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'amzwind-favorites'

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FavoriteItem[]
  } catch {
    return []
  }
}

function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFavorites())

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id && f.type === item.type)
      if (exists) {
        return prev.filter((f) => !(f.id === item.id && f.type === item.type))
      }
      return [...prev, { ...item, addedAt: Date.now() }]
    })
  }, [])

  const isFavorite = useCallback((id: string, type: FavoriteItemType) => {
    return favorites.some((f) => f.id === id && f.type === type)
  }, [favorites])

  const removeFavorite = useCallback((id: string, type: FavoriteItemType) => {
    setFavorites((prev) => prev.filter((f) => !(f.id === id && f.type === type)))
  }, [])

  const getFavoritesCount = useCallback(() => {
    return favorites.length
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite, getFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
