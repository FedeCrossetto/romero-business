import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CheckoutFormData } from '@/types'

export interface Order {
  id: string
  date: string
  items: CartItem[]
  form: CheckoutFormData
  total: number
}

interface OrderHistoryStore {
  orders: Order[]
  addOrder: (items: CartItem[], form: CheckoutFormData, total: number) => void
  clearHistory: () => void
}

export const useOrderHistory = create<OrderHistoryStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (items, form, total) => {
        const order: Order = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          items,
          form,
          total,
        }
        set((state) => ({ orders: [order, ...state.orders].slice(0, 20) }))
      },
      clearHistory: () => set({ orders: [] }),
    }),
    { name: 'romero-order-history' },
  ),
)
