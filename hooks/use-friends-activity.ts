import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/database.types"
import { useAuth } from "@/hooks/use-auth"
import { handleLikeToggle } from "@/lib/mutations/toggle-activity-like"

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
  const toggleLike = async (activityId: string) => {
    if (!user) return

    await handleLikeToggle(activityId, user.id)

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
  }

  const fetchActivities = async () => {
    const supabase = createClient()
    if (!user?.id) return

    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("profile_id", user.id)
      .eq("status", "accepted")

    if (friendsError) {
      console.error("Failed to fetch friends", friendsError)
      setLoading(false)
      return
    }

    const friendIds = friendsData?.map((f) => f.friend_id) ?? []

    if (friendIds.length === 0) {
      setActivities([])
      setLoading(false)
      return
    }

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
      .limit(15)

    if (error) {
      console.error("Error fetching friend activities:", error)
      setLoading(false)
      return
    }

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
    setLoading(false)
  }

  useEffect(() => {

    fetchActivities()

    const supabase = createClient()

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  return { activities, loading, toggleLike }
}
