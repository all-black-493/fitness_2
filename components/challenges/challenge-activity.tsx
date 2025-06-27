import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Target, TrendingUp } from "lucide-react"

interface ChallengeActivityProps {
  challengeId: string
}

export function ChallengeActivity({ challengeId }: ChallengeActivityProps) {
  const activities = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "completed day 15",
      details: "Plank hold: 4:30 (new PR!)",
      time: "2 hours ago",
      type: "achievement",
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "completed day 14",
      details: "Plank hold: 4:15",
      time: "4 hours ago",
      type: "progress",
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "reached milestone",
      details: "10 days completed! 🎉",
      time: "6 hours ago",
      type: "milestone",
    },
    {
      id: 4,
      user: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "completed day 7",
      details: "Plank hold: 2:45",
      time: "1 day ago",
      type: "progress",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "milestone":
        return <Target className="h-4 w-4 text-purple-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm">
                    <span className={`font-medium ${activity.user === "You" ? "text-primary" : ""}`}>
                      {activity.user}
                    </span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  {getActivityIcon(activity.type)}
                </div>
                <p className="text-sm font-medium text-primary mt-1">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
