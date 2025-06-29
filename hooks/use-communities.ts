"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

type Community = Database["public"]["Tables"]["communities"]["Row"]


export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [userCommunities, setUserCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchCommunities()
    if (user) {
      fetchUserCommunities()
    }
  }, [user])

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("is_private", false)
        .order("member_count", { ascending: false })

      if (error) throw error
      setCommunities(data || [])
    } catch (error) {
      console.error("Error fetching communities:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCommunities = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("community_members")
        .select(`
          communities (*)
        `)
        .eq("user_id", user.id)

      if (error) throw error
      setUserCommunities(data?.map((item) => item.communities).filter(Boolean) || [])
    } catch (error) {
      console.error("Error fetching user communities:", error)
    }
  }

  const joinCommunity = async (communityId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("community_members")
        .insert([{ community_id: communityId, profile_id: user.id }])

      if (error) throw error
      await fetchUserCommunities()
    } catch (error) {
      console.error("Error joining community:", error)
      throw error
    }
  }

  return {
    communities,
    userCommunities,
    loading,
    joinCommunity,
    refreshCommunities: fetchCommunities,
    refreshUserCommunities: fetchUserCommunities,
  }
}
