import { useState, useEffect } from "react"
import { Database } from "@/database.types"
import debounce from "lodash.debounce"

// Dynamic import for server action
const searchUsersAction = async (query: string, limit = 10) =>
  (await import("@/lib/actions/friends")).searchUsers(query, limit)

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type SearchResult = Pick<Profile, "id" | "username" | "display_name" | "avatar_url">

export function useFriendSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      setError(null)
      return
    }

    const fetch = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await searchUsersAction(query, 10)
        setResults(data || [])
      } catch (err: any) {
        console.error("Search error:", err)
        setError(err.message || "Failed to search users")
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounced = debounce(fetch, 300)
    debounced()

    return () => debounced.cancel()
  }, [query])

  return { query, setQuery, results, loading, error }
}
