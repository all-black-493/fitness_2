import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

// Dynamic import for server action
const getChallengeLeaderboardAction = async (challengeId: string) =>
  (await import("@/lib/actions/challenges")).getChallengeLeaderboard(challengeId)

interface ChallengeLeaderboardProps {
  challengeId: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string | null
  score: string | number
  streak: number
  isCurrentUser: boolean
}

export function ChallengeLeaderboard({ challengeId }: ChallengeLeaderboardProps) {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!challengeId) {
        setLeaderboard([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getChallengeLeaderboardAction(challengeId)

        if (!data) {
          setLeaderboard([])
          setLoading(false)
          return
        }

        const entries: LeaderboardEntry[] = data.map((p: any, i: number) => ({
          rank: i + 1,
          name: p.profiles?.display_name || p.profiles?.username || '-',
          avatar: p.profiles?.avatar_url || null,
          score: p.current_progress ?? '-',
          streak: p.streak ?? 0,
          isCurrentUser: user && p.profile_id === user.id,
        }))
        setLeaderboard(entries)
      } catch (err: any) {
        setError(err.message || "Failed to load leaderboard.")
      } finally {
        setLoading(false)
      }
    }

    if (challengeId) fetchLeaderboard()
  }, [challengeId, user?.id])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">{rank}</span>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-14 w-full rounded-lg mb-2" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm p-4" role="alert">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!leaderboard.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm p-4">No participants yet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((participant) => (
              <div
                key={participant.rank}
                className={`flex items-center space-x-4 p-4 rounded-lg ${participant.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-accent/50"
                  } transition-colors`}
                tabIndex={0}
                aria-label={participant.name}
              >
                <div className="flex items-center space-x-3">
                  {getRankIcon(participant.rank)}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium ${participant.isCurrentUser ? "text-primary" : ""}`}>{participant.name}</p>
                    {participant.isCurrentUser && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{participant.streak} day streak</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{participant.score}</p>
                  <p className="text-xs text-muted-foreground">Best Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
