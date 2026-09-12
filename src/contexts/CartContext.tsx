import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type CartItemType = 'experience' | 'product' | 'class'

export interface CartItem {
  id: string
  type: CartItemType
  title: string
  price: number
  quantity: number
  image_url?: string | null
  booking_date?: string | null
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, type: CartItemType) => void
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void
  setBookingDate: (id: string, type: CartItemType, date: string | null) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const CART_STORAGE_KEY = 'amzwind-active-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart())

  useEffect(() => {
    saveCart(items)
  }, [items])

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

  const setBookingDate = useCallback((id: string, type: CartItemType, date: string | null) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.type === type ? { ...i, booking_date: date } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setBookingDate,
        clearCart,
        getSubtotal,
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
