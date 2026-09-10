import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type CartItemType = 'experience' | 'product' | 'class'

export interface CartItem {
  id: string
  type: CartItemType
  title: string
  price: number
  quantity: number
  image_url?: string | null
}

interface CartContextType {
  items: CartItem[]
  checkIn: string | null
  checkOut: string | null
  nights: number
  basePricePerNight: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, type: CartItemType) => void
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void
  setCheckIn: (date: string | null) => void
  setCheckOut: (date: string | null) => void
  setBasePricePerNight: (price: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getAccommodationTotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function calcNights(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 0
  const d1 = new Date(checkIn)
  const d2 = new Date(checkOut)
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [basePricePerNight, setBasePricePerNight] = useState(150)

  const nights = calcNights(checkIn, checkOut)

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.type === newItem.type)
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.type === newItem.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string, type: CartItemType) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)))
  }, [])

  const updateQuantity = useCallback((id: string, type: CartItemType, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.type === type ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCheckIn(null)
    setCheckOut(null)
  }, [])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const getAccommodationTotal = useCallback(() => {
    return basePricePerNight * nights
  }, [basePricePerNight, nights])

  const getTotal = useCallback(() => {
    return getSubtotal() + getAccommodationTotal()
  }, [getSubtotal, getAccommodationTotal])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        checkIn,
        checkOut,
        nights,
        basePricePerNight,
        addItem,
        removeItem,
        updateQuantity,
        setCheckIn,
        setCheckOut,
        setBasePricePerNight,
        clearCart,
        getSubtotal,
        getAccommodationTotal,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
