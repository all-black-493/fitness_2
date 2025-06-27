import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserMinus } from "lucide-react"

export function FriendsList() {
  const friends = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarah_fit",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastWorkout: "2 hours ago",
      mutualFriends: 12,
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "@mike_gains",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastWorkout: "Yesterday",
      mutualFriends: 8,
    },
    {
      id: 3,
      name: "Emma Wilson",
      username: "@emma_strong",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastWorkout: "4 hours ago",
      mutualFriends: 15,
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      username: "@alex_cardio",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      lastWorkout: "6 hours ago",
      mutualFriends: 6,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Friends ({friends.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {friend.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                  friend.status === "online"
                    ? "bg-green-500"
                    : friend.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{friend.name}</p>
              <p className="text-sm text-muted-foreground truncate">{friend.username}</p>
              <p className="text-xs text-muted-foreground">Last workout: {friend.lastWorkout}</p>
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
        ))}
      </CardContent>
    </Card>
  )
}
