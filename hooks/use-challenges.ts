"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

type Challenge = Database["public"]["Tables"]["challenges"]["Row"]
type ChallengeParticipant = Database["public"]["Tables"]["challenge_participants"]["Row"]

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<ChallengeParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchChallenges()
    if (user) {
      fetchUserChallenges()
    }
  }, [user])

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .gte("end_date", new Date().toISOString().split("T")[0])
        .order("start_date", { ascending: true })

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error("Error fetching challenges:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserChallenges = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("challenge_participants").select("*").eq("profile_id", user.id)

      if (error) throw error
      setUserChallenges(data || [])
    } catch (error) {
      console.error("Error fetching user challenges:", error)
    }
  }

  const joinChallenge = async (challengeId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("challenge_participants")
        .insert([{ challenge_id: challengeId, profile_id: user.id }])

      if (error) throw error
      await fetchUserChallenges()
    } catch (error) {
      console.error("Error joining challenge:", error)
      throw error
    }
  }

  const updateProgress = async (challengeId: string, progress: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("challenge_participants")
        .update({ current_progress: progress })
        .eq("challenge_id", challengeId)
        .eq("profile_id", user.id)

      if (error) throw error
      await fetchUserChallenges()
    } catch (error) {
      console.error("Error updating challenge progress:", error)
      throw error
    }
  }

  return {
    challenges,
    userChallenges,
    loading,
    joinChallenge,
    updateProgress,
    refreshChallenges: fetchChallenges,
    refreshUserChallenges: fetchUserChallenges,
  }
}
