"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type WorkoutPlan = Database["public"]["Tables"]["workout_plans"]["Row"]

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchWorkouts()
      fetchWorkoutPlans()
    }
  }, [user])

  const fetchWorkouts = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("profile_id", user.id)
        .order("workout_date", { ascending: false })

      if (error) throw error

      setWorkouts(data || [])
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workouts:", err)
      setError(err.message || "Failed to fetch workouts.")
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkoutPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setWorkoutPlans(data || [])
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workout plans:", err)
      setError(err.message || "Failed to fetch workout plans.")
    }
  }

  const addWorkout = async (workout: Omit<Workout, "id" | "created_at" | "profile_id">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert([{ ...workout, profile_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setWorkouts((prev) => [data, ...prev])
      setError(null)
      return data
    } catch (err: any) {
      console.error("Error adding workout:", err)
      setError(err.message || "Failed to add workout.")
      throw err
    }
  }

  return {
    workouts,
    workoutPlans,
    loading,
    error,
    setError,
    addWorkout,
    refreshWorkouts: fetchWorkouts,
    refreshWorkoutPlans: fetchWorkoutPlans,
  }
}
