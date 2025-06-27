"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Trophy, Dumbbell, Target } from "lucide-react"
import { useFriendsActivity } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export function FriendsActivity() {
  const { activities, loading } = useFriendsActivity()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-4 w-4 text-blue-500" />
      case "challenge":
        return <Target className="h-4 w-4 text-purple-500" />
      case "achievement":
      case "milestone":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      default:
        return <Dumbbell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity: any) => (
          <div key={activity.id} className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  {getActivityIcon(activity.type)}
                </div>
                <p className="text-sm font-medium text-primary mt-1">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>

            <div className="flex items-center justify-between ml-13">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className={`h-8 ${activity.hasLiked ? "text-red-500" : ""}`}>
                  <Heart className={`mr-1 h-4 w-4 ${activity.hasLiked ? "fill-current" : ""}`} />
                  {activity.likes}
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  {activity.comments}
                </Button>
              </div>
            </div>

            {activity.id !== activities[activities.length - 1].id && <div className="border-b border-border ml-13" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
