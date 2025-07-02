"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"

// Dynamic imports for server actions
const getCommunityWorkoutsAction = async (communityId: string) =>
  (await import("@/lib/actions/communities")).getCommunityWorkouts(communityId)
const createCommunityWorkoutAction = async (communityId: string, workout: any) =>
  (await import("@/lib/actions/communities")).createCommunityWorkout(communityId, workout)
const updateCommunityWorkoutAction = async (communityId: string, workoutId: string, updates: any) =>
  (await import("@/lib/actions/communities")).updateCommunityWorkout(communityId, workoutId, updates)
const deleteCommunityWorkoutAction = async (communityId: string, workoutId: string) =>
  (await import("@/lib/actions/communities")).deleteCommunityWorkout(communityId, workoutId)

// CommunityWorkout type based on community_workouts table
// Adjust fields as needed to match your schema
interface CommunityWorkout extends Database["public"]["Tables"]["community_workouts"]["Row"] { }

export function useCommunityWorkouts(communityId: string) {
  const [workouts, setWorkouts] = useState<CommunityWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchWorkouts() {
    if (!communityId) {
      setWorkouts([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getCommunityWorkoutsAction(communityId)
      setWorkouts(data || [])
    } catch (err: any) {
      console.error("Error fetching community workouts:", err)
      setError(err.message || "Failed to fetch community workouts")
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkout(workout: Omit<CommunityWorkout, 'id' | 'created_at' | 'created_by'>) {
    try {
      const newWorkout = await createCommunityWorkoutAction(communityId, workout)
      setWorkouts((prev) => [newWorkout, ...prev])
      setError(null)
      return newWorkout
    } catch (err: any) {
      setError(err.message || "Failed to create workout")
      throw err
    }
  }

  async function editWorkout(workoutId: string, updates: Partial<CommunityWorkout>) {
    try {
      const updated = await updateCommunityWorkoutAction(communityId, workoutId, updates)
      setWorkouts((prev) => prev.map((w) => (w.id === workoutId ? { ...w, ...updated } : w)))
      setError(null)
      return updated
    } catch (err: any) {
      setError(err.message || "Failed to update workout")
      throw err
    }
  }

  async function deleteWorkout(workoutId: string) {
    try {
      await deleteCommunityWorkoutAction(communityId, workoutId)
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId))
      setError(null)
      return true
    } catch (err: any) {
      setError(err.message || "Failed to delete workout")
      throw err
    }
  }

  useEffect(() => {
    if (communityId) fetchWorkouts()
  }, [communityId])

  return {
    workouts,
    loading,
    error,
    refreshWorkouts: fetchWorkouts,
    createWorkout,
    editWorkout,
    deleteWorkout,
  }
}
