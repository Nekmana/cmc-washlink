import { create } from 'zustand'
import { Profile } from '@/types'

interface UserState {
    user: Profile | null
    setUser: (user: Profile | null) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
}))
