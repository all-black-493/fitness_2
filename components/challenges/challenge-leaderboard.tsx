import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface ChallengeLeaderboardProps {
  challengeId: string
}

export function ChallengeLeaderboard({ challengeId }: ChallengeLeaderboardProps) {
  const leaderboard = [
    {
      rank: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      score: "4:30",
      streak: 15,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      score: "4:15",
      streak: 14,
      isCurrentUser: false,
    },
    {
      rank: 3,
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      score: "4:00",
      streak: 13,
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      score: "3:45",
      streak: 7,
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      score: "3:30",
      streak: 12,
      isCurrentUser: false,
    },
  ]

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((participant) => (
            <div
              key={participant.rank}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                participant.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-accent/50"
              } transition-colors`}
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
                <p className="text-xs text-muted-foreground">Best Time</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
