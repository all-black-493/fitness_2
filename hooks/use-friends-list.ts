import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Database } from "@/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface Friend extends Profile {
  lastWorkout: string | null
  status: "online" | "offline" | "away"
}

export function useFriendsList() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      const supabase = createClient()
      if (!user?.id) return

      const { data, error } = await supabase
        .from("friends")
        .select(`
          friend_id,
          profiles:friend_id (
            id,
            username,
            display_name,
            avatar_url
          ),
          workouts(
            workout_date
          )
        `)
        .eq("profile_id", user.id)
        .eq("status", "accepted")

      if (error) {
        console.error("Error fetching friends list:", error)
        setLoading(false)
        return
      }

      const parsedFriends: Friend[] = data.map((entry: any) => ({
        ...entry.profiles,
        status: "offline", // Placeholder – can enhance with real-time presence later
        lastWorkout: entry.workouts?.[0]?.workout_date
          ? new Date(entry.workouts[0].workout_date).toLocaleString()
          : null,
      }))

      setFriends(parsedFriends)
      setLoading(false)
    }

    fetchFriends()
  }, [user?.id])

  return { friends, loading }
}
