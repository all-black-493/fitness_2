import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, TrendingUp, Settings, Share } from "lucide-react"

interface CommunityHeaderProps {
  communityId: string
}

//TODO: useCommunityhook for this
const getCommunityData = (id: string) => {
  const communities = {
    "1": {
      name: "Strength Training Hub",
      description: "A community for powerlifters and strength enthusiasts to share tips, progress, and motivation",
      members: 1247,
      posts: 89,
      category: "Strength",
      isJoined: true,
      isAdmin: false,
      avatar: "/placeholder.svg?height=80&width=80",
      coverImage: "/placeholder.svg?height=200&width=800",
      rules: ["Be respectful to all members", "No spam or self-promotion", "Share progress and tips"],
    },
    "2": {
      name: "Running Enthusiasts",
      description: "Share your runs, races, and running tips with fellow runners",
      members: 892,
      posts: 156,
      category: "Cardio",
      isJoined: true,
      isAdmin: false,
      avatar: "/placeholder.svg?height=80&width=80",
      coverImage: "/placeholder.svg?height=200&width=800",
      rules: ["Keep posts running-related", "Support fellow runners", "Share your achievements"],
    },
  }
  return communities[id as keyof typeof communities] || communities["1"]
}

export function CommunityHeader({ communityId }: CommunityHeaderProps) {
  const community = getCommunityData(communityId)

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 flex items-end space-x-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={community.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {community.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-white">
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{community.members.toLocaleString()} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{community.posts} posts</span>
              </div>
              <Badge variant="secondary">{community.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Community Info & Actions */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-lg">{community.description}</p>
          <div className="flex items-center space-x-2 mt-4">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Very active community</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          {community.isAdmin && (
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>
          )}
          <Button variant={community.isJoined ? "outline" : "default"} formAction={community.isJoined ? leaveCommunityAction : joinCommunityAction}>
            {community.isJoined ? "Leave Community" : "Join Community"}
          </Button>
        </div>
      </div>
    </div>
  )
}
