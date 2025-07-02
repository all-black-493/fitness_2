"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

// Dynamic imports for server actions
const getCommunities = async () => (await import("@/lib/actions/communities")).getCommunities()
const getUserCommunities = async () => (await import("@/lib/actions/communities")).getUserCommunities()
const joinCommunityAction = async (communityId: string) => (await import("@/lib/actions/communities")).joinCommunity(communityId)

type Community = Database["public"]["Tables"]["communities"]["Row"]

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [userCommunities, setUserCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  async function fetchCommunities() {
    setLoading(true)
    setError(null)
    try {
      const data = await getCommunities()
      setCommunities(data)
    } catch (err) {
      setError("Failed to fetch communities")
      setCommunities([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserCommunities() {
    if (!user) return
    setError(null)
    try {
      const data = await getUserCommunities()
      setUserCommunities(data)
    } catch (err) {
      setError("Failed to fetch user communities")
      setUserCommunities([])
    }
  }

  useEffect(() => {
    fetchCommunities()
    if (user) fetchUserCommunities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function joinCommunity(communityId: string) {
    setError(null)
    try {
      const result = await joinCommunityAction(communityId)
      if (result?.error) setError(result.error)
      await fetchUserCommunities()
      await fetchCommunities()
      return result
    } catch (err) {
      setError("Failed to join community")
      return { error: "Failed to join community" }
    }
  }

  return {
    communities,
    userCommunities,
    loading,
    error,
    joinCommunity,
    refreshCommunities: fetchCommunities,
    refreshUserCommunities: fetchUserCommunities,
  }
}
