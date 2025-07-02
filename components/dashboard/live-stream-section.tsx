"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Eye, Users } from "lucide-react"
import { toast } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { StreamVideo, Call, SpeakerLayout, CallControls } from "@stream-io/video-react-sdk"
import { useLiveStreaming } from "@/hooks/use-live-streaming"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function LiveStreamSection() {
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [startingStream, setStartingStream] = useState(false)

  const {
    loading,
    error,
    activeStreams,
    videoClient,
    currentStream,
    startLiveStream,
    endLiveStream,
    joinStream,
    leaveStream
  } = useLiveStreaming()

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      toast.error("Please enter a stream title")
      return
    }

    setStartingStream(true)
    try {
      await startLiveStream(streamTitle, streamDescription || undefined)
      setShowStartDialog(false)
      setStreamTitle("")
      setStreamDescription("")
      toast.success("Live stream started!")
    } catch (error: any) {
      toast.error(error.message || "Failed to start stream")
    } finally {
      setStartingStream(false)
    }
  }

  const handleEndStream = async () => {
    try {
      await endLiveStream()
      toast.success("Live stream ended")
    } catch (error: any) {
      toast.error(error.message || "Failed to end stream")
    }
  }

  const handleJoinStream = async (channelId: string) => {
    try {
      await joinStream(channelId)
      toast.success("Joined stream!")
    } catch (error: any) {
      toast.error(error.message || "Failed to join stream")
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-red-600">
            <p>Error loading live streams: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Live Workouts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setShowStartDialog(true)}
                className="w-full"
                variant="default"
                disabled={loading || !!currentStream}
              >
                <Video className="mr-2 h-4 w-4" />
                Start Live Stream
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Live Stream</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Stream Title *</Label>
                  <Input
                    id="title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="e.g., Morning HIIT Workout"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    placeholder="Describe your workout session..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleStartStream}
                  disabled={startingStream || !streamTitle.trim()}
                  className="w-full"
                >
                  {startingStream ? "Starting..." : "Start Stream"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {currentStream && (
            <Button
              onClick={handleEndStream}
              className="w-full"
              variant="destructive"
              disabled={loading}
            >
              <VideoOff className="mr-2 h-4 w-4" />
              End Stream
            </Button>
          )}

          {loading && <LoadingSkeleton className="h-64 w-full" />}

          {currentStream && videoClient && currentStream.call ? (
            <StreamVideo client={videoClient}>
              <Call call={currentStream.call}>
                <div className="rounded-lg overflow-hidden border">
                  <SpeakerLayout />
                  <CallControls />
                </div>
              </Call>
            </StreamVideo>
          ) : !currentStream && (
            <div className="p-4 text-center text-muted-foreground border rounded-lg">
              <p>No live stream active. Click "Start Live Stream" to go live.</p>
            </div>
          )}

          {/* Active Streams */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Streams</h4>
            {activeStreams.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active streams right now</p>
              </div>
            ) : (
              activeStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleJoinStream(stream.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={stream.creator.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {stream.creator.display_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{stream.creator.display_name}</p>
                    <p className="text-xs text-muted-foreground">{stream.title}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3 text-red-500" />
                    <span className="text-xs">{stream.memberCount}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    LIVE
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
