import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Database } from "@/database.types"

// Dynamic import for server action
const getFriendSuggestionsAction = async (search: string = "", limit = 10) =>
    (await import("@/lib/actions/friends")).getFriendSuggestions(search, limit)

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type SuggestedProfile = Pick<Profile, "id" | "username" | "display_name" | "avatar_url">

export function useFriendSuggestions(search: string = "") {
    const { user } = useAuth()
    const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user?.id) {
                setSuggestions([])
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = await getFriendSuggestionsAction(search, 10)
                setSuggestions(data)
            } catch (err: any) {
                setError(err.message || "Failed to fetch friend suggestions")
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }

        fetchSuggestions()
    }, [user?.id, search])

    return { suggestions, loading, error }
}
