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
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()

    if (!user?.id) return

    const channel = supabase.channel("presence:online-users", {
      config: { presence: { key: user.id } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const ids = new Set<string>()

        for (const profileId in state) {
          if (Object.hasOwn(state, profileId)) {
            ids.add(profileId)
          }
        }

        setOnlineIds(ids)
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return
        channel.track({})
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

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
        status: onlineIds.has(entry.friend_id) ? "online" : "offline",
        lastWorkout: entry.workouts?.[0]?.workout_date
          ? new Date(entry.workouts[0].workout_date).toLocaleString()
          : null,
      }))

      setFriends(parsedFriends)
      setLoading(false)
    }

    fetchFriends()
  }, [user?.id, onlineIds])

  return { friends, loading }
}
