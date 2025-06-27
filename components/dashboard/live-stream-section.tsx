"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Eye } from "lucide-react"
import { toast } from "sonner"

export function LiveStreamSection() {
  const [isStreaming, setIsStreaming] = useState(false)

  const liveStreams = [
    {
      id: 1,
      user: "Sarah Fit",
      workout: "Morning HIIT",
      viewers: 24,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "Mike Strong",
      workout: "Deadlift Session",
      viewers: 18,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const toggleStream = () => {
    if (isStreaming) {
      setIsStreaming(false)
      toast.success("Stream ended")
    } else {
      setIsStreaming(true)
      toast.success("Live stream started! 📹")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Video className="h-5 w-5" />
          <span>Live Workouts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start Stream Button */}
        <Button onClick={toggleStream} className="w-full" variant={isStreaming ? "destructive" : "default"}>
          {isStreaming ? (
            <>
              <VideoOff className="mr-2 h-4 w-4" />
              End Stream
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Start Live Stream
            </>
          )}
        </Button>

        {isStreaming && (
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                You're live! 12 viewers watching
              </span>
            </div>
          </div>
        )}

        {/* Active Streams */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Active Streams</h4>
          {liveStreams.map((stream) => (
            <div
              key={stream.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={stream.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {stream.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{stream.user}</p>
                <p className="text-xs text-muted-foreground">{stream.workout}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-red-500" />
                <span className="text-xs">{stream.viewers}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                LIVE
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
