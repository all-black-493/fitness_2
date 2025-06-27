import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Trophy } from "lucide-react"

export function ActivityFeed() {
  const activities = [
    {
      user: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "completed a workout",
      details: "Upper Body Strength",
      time: "2 hours ago",
      type: "workout",
      likes: 12,
      comments: 3,
    },
    {
      user: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "joined a challenge",
      details: "30-Day Cardio Challenge",
      time: "4 hours ago",
      type: "challenge",
      likes: 8,
      comments: 1,
    },
    {
      user: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "achieved a new PR",
      details: "Deadlift: 185 lbs",
      time: "6 hours ago",
      type: "achievement",
      likes: 24,
      comments: 7,
    },
    {
      user: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "completed a workout",
      details: "HIIT Cardio Session",
      time: "8 hours ago",
      type: "workout",
      likes: 15,
      comments: 2,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
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
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-sm font-medium text-primary">{activity.details}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span className="text-xs">{activity.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs">{activity.comments}</span>
                  </div>
                </div>
              </div>
            </div>
            {activity.type === "achievement" && <Trophy className="h-4 w-4 text-yellow-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
