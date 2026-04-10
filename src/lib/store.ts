import { create } from 'zustand'

interface AppState {
  currentUser: string | null
  setCurrentUser: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: 'user_1', // 默认用户用于演示
  setCurrentUser: (id) => set({ currentUser: id }),
}))
