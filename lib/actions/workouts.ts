"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/database.types"

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type WorkoutInsert = Database["public"]["Tables"]["workouts"]["Insert"]
type WorkoutUpdate = Database["public"]["Tables"]["workouts"]["Update"]

export async function createWorkout(workout: Omit<WorkoutInsert, "id" | "created_at">) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      ...workout,
      profile_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating workout:", error)
    throw new Error("Failed to create workout")
  }

  revalidatePath("/workouts")
  revalidatePath("/")
  return data
}

export async function updateWorkout(workoutId: string, updates: Partial<WorkoutUpdate>) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("workouts")
    .update(updates)
    .eq("id", workoutId)
    .eq("profile_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating workout:", error)
    throw new Error("Failed to update workout")
  }

  revalidatePath("/workouts")
  revalidatePath("/")
  return data
}

export async function deleteWorkout(workoutId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("profile_id", user.id)

  if (error) {
    console.error("Error deleting workout:", error)
    throw new Error("Failed to delete workout")
  }

  revalidatePath("/workouts")
  revalidatePath("/")
  return { success: true }
}

export async function getUserWorkouts(limit = 10) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("profile_id", user.id)
    .order("workout_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching workouts:", error)
    throw new Error("Failed to fetch workouts")
  }

  return data || []
}

export async function getFriendWorkouts(limit = 20) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Get user's friends
  const { data: friends } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("profile_id", user.id)
    .eq("status", "accepted")

  if (!friends || friends.length === 0) {
    return []
  }

  const friendIds = friends.map(f => f.friend_id)

  // Get workouts from friends
  const { data, error } = await supabase
    .from("workouts")
    .select(`
      *,
      profiles:profile_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .in("profile_id", friendIds)
    .order("workout_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching friend workouts:", error)
    throw new Error("Failed to fetch friend workouts")
  }

  return data || []
}

export async function likeWorkout(workoutId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("workout_likes")
    .select("id")
    .eq("workout_id", workoutId)
    .eq("profile_id", user.id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("workout_likes")
      .delete()
      .eq("workout_id", workoutId)
      .eq("profile_id", user.id)

    if (error) {
      console.error("Error unliking workout:", error)
      throw new Error("Failed to unlike workout")
    }
  } else {
    // Like
    const { error } = await supabase
      .from("workout_likes")
      .insert({
        workout_id: workoutId,
        profile_id: user.id,
      })

    if (error) {
      console.error("Error liking workout:", error)
      throw new Error("Failed to like workout")
    }
  }

  revalidatePath("/workouts")
  revalidatePath("/")
  return { success: true }
}

export async function commentOnWorkout(workoutId: string, content: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("workout_comments")
    .insert({
      workout_id: workoutId,
      profile_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error commenting on workout:", error)
    throw new Error("Failed to comment on workout")
  }

  revalidatePath("/workouts")
  revalidatePath("/")
  return data
}

export async function getFriendActivities(limit = 15) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Get user's friends
  const { data: friendsData, error: friendsError } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("profile_id", user.id)
    .eq("status", "accepted")

  if (friendsError) {
    console.error("Error fetching friends:", friendsError)
    throw new Error("Failed to fetch friends")
  }

  const friendIds = friendsData?.map(f => f.friend_id) ?? []

  if (friendIds.length === 0) {
    return []
  }

  // Get activities from friends
  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,
      action,
      type,
      created_at,
      workout:workouts (
        id,
        name,
        workout_date,
        calories_burned,
        duration_minutes,
        tags,
        completed,
        notes,
        profile_id,
        created_at,
        exercises
      ),
      profile:profiles (
        id,
        username,
        avatar_url,
        display_name
      ),
      activity_likes(count),
      activity_likes(user_has_liked:profile_id),
      activity_comments(count)
    `)
    .in("profile_id", friendIds)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching friend activities:", error)
    throw new Error("Failed to fetch friend activities")
  }

  return data || []
}

export async function toggleActivityLike(activityId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if already liked
  const { data: existingLike, error: checkError } = await supabase
    .from("activity_likes")
    .select("id")
    .eq("activity_id", activityId)
    .eq("profile_id", user.id)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking like status:", checkError)
    throw new Error("Failed to check like status")
  }

  if (existingLike) {
    // Unlike
    const { error: unlikeError } = await supabase
      .from("activity_likes")
      .delete()
      .eq("id", existingLike.id)

    if (unlikeError) {
      console.error("Error unliking activity:", unlikeError)
      throw new Error("Failed to unlike activity")
    }
  } else {
    // Like
    const { error: likeError } = await supabase
      .from("activity_likes")
      .insert({
        activity_id: activityId,
        profile_id: user.id,
      })

    if (likeError) {
      console.error("Error liking activity:", likeError)
      throw new Error("Failed to like activity")
    }
  }

  revalidatePath("/")
  return { success: true }
}

export async function getWorkoutPlans() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching workout plans:", error)
    throw new Error("Failed to fetch workout plans")
  }

  return data || []
}
