"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  UserMinus,
} from "lucide-react"
import { useFriendsList } from "@/hooks/use-friends-list"

export function FriendsList() {
  const { friends, loading } = useFriendsList()
  const onlineCount = friends.filter((f) => f.status === "online").length


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Your Friends ({friends.length})
          <span className="text-sm font-normal text-muted-foreground ml-1">
            — {onlineCount} online
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={friend.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {friend.display_name
                      ? friend.display_name.split(" ").map((n) => n[0]).join("")
                      : "??"}

                  </AvatarFallback>
                </Avatar>
                <div
                  title={friend.status}
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${friend.status === "online"
                    ? "bg-green-500"
                    : friend.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                    }`}
                />

              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{friend.display_name}</p>
                <p className="text-sm text-muted-foreground truncate">@{friend.username}</p>
                <p className="text-xs text-muted-foreground">
                  Last workout: {friend.lastWorkout ?? "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
