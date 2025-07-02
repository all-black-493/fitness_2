import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Trophy } from "lucide-react"
import { useFriendsActivity } from "@/hooks/use-friends-activity"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

export function ActivityFeed() {
  const { activities, loading, toggleLike } = useFriendsActivity()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Friend Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!activities.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Friend Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm p-4">No recent activity from your friends yet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Friend Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              tabIndex={0}
              aria-label={`${activity.profile.display_name || activity.profile.username} ${activity.action}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {(activity.profile.display_name || activity.profile.username || "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.profile.display_name || activity.profile.username}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                {activity.workout?.name && (
                  <p className="text-sm font-medium text-primary">{activity.workout.name}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      aria-pressed={activity.hasLiked}
                      aria-label={activity.hasLiked ? "Unlike" : "Like"}
                      className={`flex items-center space-x-1 focus:outline-none ${activity.hasLiked ? "text-red-500" : "text-muted-foreground"}`}
                      onClick={() => toggleLike(activity.id)}
                    >
                      <Heart className="h-3 w-3" fill={activity.hasLiked ? "currentColor" : "none"} />
                      <span className="text-xs">{activity.likes}</span>
                    </button>
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
    </ErrorBoundary>
  )
}
