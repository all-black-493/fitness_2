"use client"

import { useFriendSearch } from "@/hooks/use-friend-search"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search } from "lucide-react"

export function FriendsHeader() {
  const { query, setQuery, results, loading } = useFriendSearch()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Friends</h1>
          <p className="text-muted-foreground">Connect with your fitness community</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Friends
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
      {results.length > 0 && (
        <div className="space-y-2 pt-2">
          {results.map((profile) => (
            <div key={profile.id} className="text-sm">
              {profile.display_name} (@{profile.username})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
