"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

interface ChallengeDiscussionProps {
  challengeId: string
}

export function ChallengeDiscussion({ challengeId }: ChallengeDiscussionProps) {
  const [newComment, setNewComment] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const discussions = [
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2 hours ago",
      content:
        "Day 15 complete! 🎉 This challenge has really helped me build core strength. Anyone else feeling the difference?",
      likes: 12,
      replies: 3,
      hasLiked: false,
    },
    {
      id: 2,
      author: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "5 hours ago",
      content: "Struggling to maintain proper form after 2 minutes. Any tips for keeping the body straight?",
      likes: 8,
      replies: 5,
      hasLiked: true,
    },
    {
      id: 3,
      author: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 day ago",
      content: "Halfway through the challenge! 💪 My personal best is now 3:30. Let's keep pushing each other!",
      likes: 15,
      replies: 7,
      hasLiked: false,
    },
  ]

  const handlePost = async () => {
    if (!newComment.trim()) {
      toast.error("Please write something before posting")
      return
    }

    setIsPosting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Comment posted! 💬")
    setNewComment("")
    setIsPosting(false)
  }

  return (
    <div className="space-y-6">
      {/* Post Comment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Join the Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your progress, ask questions, or motivate others..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end">
                <Button formAction={handlePost} disabled={isPosting || !newComment.trim()}>
                  {isPosting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussion Feed */}
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {discussion.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{discussion.author}</p>
                      <p className="text-xs text-muted-foreground">{discussion.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Comment Content */}
                <p className="text-sm leading-relaxed">{discussion.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center space-x-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className={discussion.hasLiked ? "text-red-500" : ""}>
                    <Heart className={`mr-1 h-4 w-4 ${discussion.hasLiked ? "fill-current" : ""}`} />
                    {discussion.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {discussion.replies}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
