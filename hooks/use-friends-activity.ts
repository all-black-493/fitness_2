import { useEffect, useState } from "react"
import { Database } from "@/database.types"
import { useAuth } from "@/hooks/use-auth"

// Dynamic imports for server actions
const getFriendActivitiesAction = async (limit = 15) =>
  (await import("@/lib/actions/workouts")).getFriendActivities(limit)
const toggleActivityLikeAction = async (activityId: string) =>
  (await import("@/lib/actions/workouts")).toggleActivityLike(activityId)

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ActivityType = Database["public"]["Enums"]["activity_type"]

interface FriendActivity {
  id: string
  workout: Workout | null
  profile: Profile
  action: string
  time: string
  type: ActivityType
  likes: number
  comments: number
  hasLiked: boolean
}

export function useFriendsActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<FriendActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    if (!user?.id) {
      setActivities([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getFriendActivitiesAction(15)

      const formatted: FriendActivity[] = data.map((activity: any) => ({
        id: activity.id,
        workout: activity.workout ?? null,
        profile: activity.profile,
        action: activity.action,
        time: new Date(activity.created_at).toLocaleString(),
        type: activity.type,
        likes: activity.activity_likes?.[0]?.count ?? 0,
        comments: activity.activity_comments?.[0]?.count ?? 0,
        hasLiked:
          Array.isArray(activity.activity_likes?.user_has_liked) &&
          activity.activity_likes.user_has_liked.some(
            (like: any) => like.profile_id === user.id
          ),
      }))

      setActivities(formatted)
    } catch (err: any) {
      setError(err.message || "Failed to fetch friend activities")
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (activityId: string) => {
    if (!user) return

    try {
      await toggleActivityLikeAction(activityId)

      // Optimistically update the UI
      setActivities((prev) =>
        prev.map((activity) => {
          if (activity.id !== activityId) return activity

          const hasLiked = !activity.hasLiked
          const likes = hasLiked ? activity.likes + 1 : activity.likes - 1

          return {
            ...activity,
            hasLiked,
            likes,
          }
        })
      )
    } catch (err: any) {
      setError(err.message || "Failed to toggle like")
    }
  }

  useEffect(() => {
    fetchActivities()

    // Set up realtime subscription for activities
    let supabase: any
    let channel: any

    import("@/lib/supabase-utils/client").then(({ createClient }) => {
      supabase = createClient()
      channel = supabase
        .channel("realtime:activities")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activities" },
          fetchActivities
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activity_likes" },
          fetchActivities
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activity_comments" },
          fetchActivities
        )
        .subscribe()
    })

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id])

  return { activities, loading, error, toggleLike }
}
