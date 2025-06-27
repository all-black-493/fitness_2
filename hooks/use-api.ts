"use client"

import { useState, useEffect } from "react"

const API_BASE = "/api"
const AUTH_TOKEN = "mock-token-123" // In real app, get from auth context

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTH_TOKEN}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error || "API request failed")
  }

  return data
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const response = await apiRequest("/workouts")
      setWorkouts(response.data.workouts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch workouts")
    } finally {
      setLoading(false)
    }
  }

  const createWorkout = async (workoutData: any) => {
    try {
      const response = await apiRequest("/workouts", {
        method: "POST",
        body: JSON.stringify(workoutData),
      })
      await fetchWorkouts() // Refresh list
      return response.data
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  return { workouts, loading, error, createWorkout, refetch: fetchWorkouts }
}

export function useFriendsActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await apiRequest("/friends/activity")
        setActivities(response.data.activities)
      } catch (err) {
        console.error("Failed to fetch activities:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading }
}

export function useCommunities() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await apiRequest("/communities")
        setCommunities(response.data.communities)
      } catch (err) {
        console.error("Failed to fetch communities:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  return { communities, loading }
}

export function useCommunityPosts(communityId: string) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await apiRequest(`/communities/${communityId}/posts`)
      setPosts(response.data.posts)
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string) => {
    try {
      await apiRequest(`/communities/${communityId}/posts`, {
        method: "POST",
        body: JSON.stringify({ content }),
      })
      await fetchPosts() // Refresh posts
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [communityId])

  return { posts, loading, createPost }
}

export function useChallenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await apiRequest("/challenges")
        setChallenges(response.data.challenges)
      } catch (err) {
        console.error("Failed to fetch challenges:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  return { challenges, loading }
}

export function useAIPlanner() {
  const [loading, setLoading] = useState(false)

  const generatePlan = async (planData: any) => {
    try {
      setLoading(true)
      const response = await apiRequest("/ai-planner/generate", {
        method: "POST",
        body: JSON.stringify(planData),
      })
      return response.data
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generatePlan, loading }
}
