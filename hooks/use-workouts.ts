"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

// Dynamic imports for server actions
const getUserWorkoutsAction = async () =>
  (await import("@/lib/actions/workouts")).getUserWorkouts()
const getWorkoutPlansAction = async () =>
  (await import("@/lib/actions/workouts")).getWorkoutPlans()
const createWorkoutAction = async (workout: any) =>
  (await import("@/lib/actions/workouts")).createWorkout(workout)

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type WorkoutPlan = Database["public"]["Tables"]["workout_plans"]["Row"]

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchWorkouts = async () => {
    if (!user) {
      setWorkouts([])
      setLoading(false)
      return
    }

    try {
      const data = await getUserWorkoutsAction()
      setWorkouts(data)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workouts:", err)
      setError(err.message || "Failed to fetch workouts.")
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkoutPlans = async () => {
    try {
      const data = await getWorkoutPlansAction()
      setWorkoutPlans(data)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workout plans:", err)
      setError(err.message || "Failed to fetch workout plans.")
      setWorkoutPlans([])
    }
  }

  const addWorkout = async (workout: Omit<Workout, "id" | "created_at" | "profile_id">) => {
    if (!user) return

    try {
      const data = await createWorkoutAction(workout)
      setWorkouts((prev) => [data, ...prev])
      setError(null)
      return data
    } catch (err: any) {
      console.error("Error adding workout:", err)
      setError(err.message || "Failed to add workout.")
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchWorkouts()
      fetchWorkoutPlans()
    }
  }, [user])

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
