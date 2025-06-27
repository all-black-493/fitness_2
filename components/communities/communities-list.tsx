"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useCommunities } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export function CommunitiesList() {
  const { communities, loading } = useCommunities()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {communities.map((community: any) => (
        <Card key={community.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={community.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {community.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center space-x-2">
                  <span className="truncate">{community.name}</span>
                  <Badge variant="outline">{community.category}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Community Stats */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{community.members.toLocaleString()} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{community.posts} posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Active</span>
              </div>
            </div>

            {/* Recent Post Preview */}
            <div className="bg-accent/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {community.recentPost.author
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{community.recentPost.author}</span>
                <span className="text-xs text-muted-foreground">{community.recentPost.time}</span>
              </div>
              <p className="text-sm">{community.recentPost.content}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>❤️ {community.recentPost.likes}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/communities/${community.id}`}>
              <Button className="w-full" variant={community.isJoined ? "outline" : "default"}>
                {community.isJoined ? "View Community" : "Join Community"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
