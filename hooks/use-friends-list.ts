import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Database } from "@/database.types"

// Dynamic import for server action
const getFriendsAction = async () => (await import("@/lib/actions/friends")).getFriends()

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

  // Presence logic (Supabase Realtime)
  useEffect(() => {
    // Only run presence logic if user is logged in
    if (!user?.id) return
    // Dynamic import to avoid bundling supabase client in SSR
    let supabase: any
    let channel: any
    import("@/lib/supabase-utils/client").then(({ createClient }) => {
      supabase = createClient()
      channel = supabase.channel("presence:online-users", {
        config: { presence: { key: user.id } },
      })
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState()
          const ids = new Set<string>()
          for (const profileId in state) {
            if (Object.hasOwn(state, profileId)) ids.add(profileId)
          }
          setOnlineIds(ids)
        })
        .subscribe((status: string) => {
          if (status !== "SUBSCRIBED") return
          channel.track({})
        })
    })
    return () => {
      if (supabase && channel) supabase.removeChannel(channel)
    }
  }, [user?.id])

  // Fetch friends list from server action
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true)
      try {
        const data = await getFriendsAction()
        // Map to Friend type, add status based on onlineIds
        const parsedFriends: Friend[] = (data || []).map((entry: any) => {
          // The server action returns friend.friend as the profile
          const profile = entry.friend || entry.profile || entry
          return {
            ...profile,
            status: onlineIds.has(profile.id) ? "online" : "offline",
            lastWorkout: profile.workouts?.[0]?.workout_date
              ? new Date(profile.workouts[0].workout_date).toLocaleString()
              : null,
          }
        })
        setFriends(parsedFriends)
      } catch (error) {
        setFriends([])
      } finally {
        setLoading(false)
      }
    }
    if (user?.id) fetchFriends()
  }, [user?.id, onlineIds])

  return { friends, loading }
}
