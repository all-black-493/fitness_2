import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Database } from "@/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type SuggestedProfile = Pick<Profile, "id" | "username" | "display_name" | "avatar_url">

export function useFriendSuggestions(search: string = "") {
    const { user } = useAuth()
    const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user?.id) return
            const supabase = createClient()

            const { data: friendsData, error: friendsError } = await supabase
                .from("friends")
                .select("profile_id, friend_id")
                .or(`profile_id.eq.${user.id},friend_id.eq.${user.id}`)
                .in("status", ["accepted", "pending"])

            if (friendsError) {
                console.error("Error fetching friend relationships", friendsError)
                setLoading(false)
                return
            }

            const excludedIds = new Set<string>()
            excludedIds.add(user.id)

            friendsData?.forEach((relation) => {
                excludedIds.add(relation.profile_id)
                excludedIds.add(relation.friend_id)
            })

            const formattedExclusion = `(${Array.from(excludedIds).join(",")})`

            let query = supabase
                .from("profiles")
                .select("id, username, display_name, avatar_url")

            if (excludedIds.size > 0) {
                query = query.not("id", "in", formattedExclusion)
            }

            if (search) {
                query = query.ilike("username", `%${search}%`)
            }

            const { data: profiles, error: profilesError } = await query.limit(10)

            if (profilesError) {
                console.error("Error fetching suggested profiles", profilesError)
                setLoading(false)
                return
            }

            setSuggestions(profiles || [])
            setLoading(false)
        }

        fetchSuggestions()
    }, [user?.id, search])

    return { suggestions, loading }
}
