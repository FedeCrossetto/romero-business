import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface SavedListStore {
  list: CartItem[]
  savedAt: string | null
  saveList: (items: CartItem[]) => void
  clearList: () => void
}

export const useSavedList = create<SavedListStore>()(
  persist(
    (set) => ({
      list: [],
      savedAt: null,
      saveList: (items) => set({ list: items, savedAt: new Date().toISOString() }),
      clearList: () => set({ list: [], savedAt: null }),
    }),
    { name: 'romero-saved-list' },
  ),
)
