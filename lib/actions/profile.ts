"use server"

import { createClient } from "@/lib/supabase-utils/server"
import type { Database } from "@/database.types"

export async function getUserProfile(username: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single()

    if (error) {
        console.error("Error fetching user profile:", error)
        throw new Error("Failed to fetch user profile")
    }

    return data
}

export async function getUserStats(userId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .rpc("get_user_stats", { user_id: userId })

    if (error) {
        console.error("Error fetching user stats:", error)
        throw new Error("Failed to fetch user stats")
    }

    return data
}

export async function getUserAchievements(userId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", userId)

    if (error) {
        console.error("Error fetching user achievements:", error)
        throw new Error("Failed to fetch user achievements")
    }

    return data || []
}

export async function getUserMilestones(userId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("profile_id", userId)

    if (error) {
        console.error("Error fetching user milestones:", error)
        throw new Error("Failed to fetch user milestones")
    }

    return data || []
}

export async function getUserChallenges(userId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("challenge_participants")
        .select("*, challenge:challenges(*)")
        .eq("profile_id", userId)

    if (error) {
        console.error("Error fetching user challenges:", error)
        throw new Error("Failed to fetch user challenges")
    }

    return data || []
}

export async function getUserCommunities(userId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("community_members")
        .select("*, community:communities(*)")
        .eq("user_id", userId)

    if (error) {
        console.error("Error fetching user communities:", error)
        throw new Error("Failed to fetch user communities")
    }

    return data || []
}

export async function getUserRecentActivity(userId: string, limit = 10) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Error fetching user recent activity:", error)
        throw new Error("Failed to fetch user recent activity")
    }

    return data || []
}

export async function getCurrentUserProfile() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    if (error) {
        console.error("Error fetching current user profile:", error)
        throw new Error("Failed to fetch current user profile")
    }
    return data
} 