import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/database.types"
import debounce from "lodash.debounce"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type SearchResult = Pick<Profile, "id" | "username" | "display_name" | "avatar_url">


export function useFriendSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const supabase = createClient()
    const fetch = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .ilike("username", `%${query}%`)
        .limit(10)

      if (error) {
        console.error("Search error:", error)
        setResults([])
      } else {
        setResults(data || [])
      }

      setLoading(false)
    }

    const debounced = debounce(fetch, 300)
    debounced()

    return () => debounced.cancel()
  }, [query])

  return { query, setQuery, results, loading }
}
