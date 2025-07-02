import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
    notifications: any[]
    user: any | null
    isSidebarOpen: boolean
    setNotifications: (notifications: any[]) => void
    setUser: (user: any | null) => void
    setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            notifications: [],
            user: null,
            isSidebarOpen: false,
            setNotifications: (notifications) => set({ notifications }),
            setUser: (user) => set({ user }),
            setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen })
        }),
        { name: 'app-store' }
    )
) 