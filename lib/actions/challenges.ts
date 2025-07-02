"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/database.types"

type Challenge = Database["public"]["Tables"]["challenges"]["Row"]
type ChallengeInsert = Database["public"]["Tables"]["challenges"]["Insert"]
type ChallengeUpdate = Database["public"]["Tables"]["challenges"]["Update"]

export async function createChallenge(challenge: Omit<ChallengeInsert, "id" | "created_at" | "participants_count">) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenges")
        .insert({
            ...challenge,
            created_by: user.id,
            participants_count: 0,
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating challenge:", error)
        throw new Error("Failed to create challenge")
    }

    revalidatePath("/challenges")
    return data
}

export async function updateChallenge(challengeId: string, updates: Partial<ChallengeUpdate>) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenges")
        .update(updates)
        .eq("id", challengeId)
        .eq("created_by", user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating challenge:", error)
        throw new Error("Failed to update challenge")
    }

    revalidatePath("/challenges")
    revalidatePath(`/challenges/${challengeId}`)
    return data
}

export async function deleteChallenge(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { error } = await supabase
        .from("challenges")
        .delete()
        .eq("id", challengeId)
        .eq("created_by", user.id)

    if (error) {
        console.error("Error deleting challenge:", error)
        throw new Error("Failed to delete challenge")
    }

    revalidatePath("/challenges")
    return { success: true }
}

export async function joinChallenge(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    // Check if already participating
    const { data: existingParticipation } = await supabase
        .from("challenge_participants")
        .select("id")
        .eq("challenge_id", challengeId)
        .eq("profile_id", user.id)
        .single()

    if (existingParticipation) {
        throw new Error("Already participating in this challenge")
    }

    // Check if challenge is still active
    const { data: challenge } = await supabase
        .from("challenges")
        .select("end_date")
        .eq("id", challengeId)
        .single()

    if (!challenge || new Date(challenge.end_date) < new Date()) {
        throw new Error("Challenge has ended")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .insert({
            challenge_id: challengeId,
            profile_id: user.id,
            current_progress: 0,
        })
        .select()
        .single()

    if (error) {
        console.error("Error joining challenge:", error)
        throw new Error("Failed to join challenge")
    }

    // Update challenge participant count
    await supabase.rpc("increment_challenge_participants", { challenge_id: challengeId })

    revalidatePath("/challenges")
    revalidatePath(`/challenges/${challengeId}`)
    return data
}

export async function leaveChallenge(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { error } = await supabase
        .from("challenge_participants")
        .delete()
        .eq("challenge_id", challengeId)
        .eq("profile_id", user.id)

    if (error) {
        console.error("Error leaving challenge:", error)
        throw new Error("Failed to leave challenge")
    }

    // Update challenge participant count
    await supabase.rpc("decrement_challenge_participants", { challenge_id: challengeId })

    revalidatePath("/challenges")
    revalidatePath(`/challenges/${challengeId}`)
    return { success: true }
}

export async function updateChallengeProgress(challengeId: string, progress: number) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .update({ current_progress: progress })
        .eq("challenge_id", challengeId)
        .eq("profile_id", user.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating challenge progress:", error)
        throw new Error("Failed to update challenge progress")
    }

    revalidatePath(`/challenges/${challengeId}`)
    return data
}

export async function getChallenges(limit = 20) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenges")
        .select(`
      *,
      creator:created_by (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Error fetching challenges:", error)
        throw new Error("Failed to fetch challenges")
    }

    return data || []
}

export async function getChallenge(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenges")
        .select(`
      *,
      creator:created_by (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
        .eq("id", challengeId)
        .single()

    if (error) {
        console.error("Error fetching challenge:", error)
        throw new Error("Failed to fetch challenge")
    }

    return data
}

export async function getChallengeParticipants(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .select(`
      *,
      profile:profile_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
        .eq("challenge_id", challengeId)
        .order("current_progress", { ascending: false })

    if (error) {
        console.error("Error fetching challenge participants:", error)
        throw new Error("Failed to fetch challenge participants")
    }

    return data || []
}

export async function getUserChallenges() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .select(`
      *,
      challenge:challenge_id (
        *,
        creator:created_by (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
        .eq("profile_id", user.id)
        .order("joined_at", { ascending: false })

    if (error) {
        console.error("Error fetching user challenges:", error)
        throw new Error("Failed to fetch user challenges")
    }

    return data || []
}

export async function getChallengeLeaderboard(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .select(`
      *,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
        .eq("challenge_id", challengeId)
        .order("current_progress", { ascending: false })

    if (error) {
        console.error("Error fetching challenge leaderboard:", error)
        throw new Error("Failed to fetch challenge leaderboard")
    }

    return data || []
}

export async function getChallengeActivities(challengeId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_activities")
        .select(`
      *,
      profile:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
        .eq("challenge_id", challengeId)
        .order("created_at", { ascending: false })
        .limit(30)

    if (error) {
        console.error("Error fetching challenge activities:", error)
        throw new Error("Failed to fetch challenge activities")
    }

    return data || []
} 