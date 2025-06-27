"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, MoreHorizontal, ImageIcon, Video } from "lucide-react"
import { toast } from "sonner"
import { useCommunityPosts } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

interface CommunityPostsProps {
  communityId: string
}

export function CommunityPosts({ communityId }: CommunityPostsProps) {
  const [newPost, setNewPost] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { posts, loading, createPost } = useCommunityPosts(communityId)

  const handlePost = async () => {
    if (!newPost.trim()) {
      toast.error("Please write something before posting")
      return
    }

    setIsPosting(true)
    try {
      await createPost(newPost)
      toast.success("Post shared with the community! 🎉")
      setNewPost("")
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "question":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "discussion":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-20 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your progress, ask questions, or start a discussion..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ImageIcon className="mr-2 h-4 w-4" />
                Photo
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>
            </div>
            <Button onClick={handlePost} disabled={isPosting || !newPost.trim()}>
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post.id} className={post.isPinned ? "border-primary" : ""}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Post Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{post.author}</p>
                        {post.isPinned && (
                          <Badge variant="secondary" className="text-xs">
                            Pinned
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getPostTypeColor(post.type)}`}>{post.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {/* Post Images */}
                  {post.images && (
                    <div className="grid grid-cols-1 gap-2">
                      {post.images.map((image: string, index: number) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img
                            src={image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className={post.hasLiked ? "text-red-500" : ""}>
                      <Heart className={`mr-1 h-4 w-4 ${post.hasLiked ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
