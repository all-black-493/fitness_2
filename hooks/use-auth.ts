"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  email: string
  username: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.data)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  }
}
