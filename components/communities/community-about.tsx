import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, Shield } from "lucide-react"

interface CommunityAboutProps {
  communityId: string
}

export function CommunityAbout({ communityId }: CommunityAboutProps) {
  const communityInfo = {
    description:
      "A community for powerlifters and strength enthusiasts to share tips, progress, and motivation. Whether you're a beginner or advanced lifter, everyone is welcome to learn and grow together.",
    created: "January 15, 2024",
    category: "Strength Training",
    privacy: "Public",
    rules: [
      "Be respectful to all members",
      "No spam or self-promotion without permission",
      "Share progress and tips constructively",
      "Keep posts relevant to strength training",
      "No harassment or discriminatory language",
      "Use appropriate content warnings for injury discussions",
    ],
    moderators: [
      { name: "Coach Johnson", role: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mike Strong", role: "Moderator", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    stats: {
      totalMembers: 1247,
      totalPosts: 89,
      postsThisWeek: 23,
      activeMembers: 156,
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Community Description */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About This Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{communityInfo.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{communityInfo.created}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Privacy</p>
                  <p className="text-sm text-muted-foreground">{communityInfo.privacy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Community Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {communityInfo.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{rule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        {/* Community Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Community Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Members</span>
              </div>
              <span className="font-medium">{communityInfo.stats.totalMembers.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Posts</span>
              </div>
              <span className="font-medium">{communityInfo.stats.totalPosts}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">Posts This Week</span>
              </div>
              <span className="font-medium text-green-600">{communityInfo.stats.postsThisWeek}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Active Members</span>
              </div>
              <span className="font-medium text-blue-600">{communityInfo.stats.activeMembers}</span>
            </div>
          </CardContent>
        </Card>

        {/* Moderators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Moderators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {communityInfo.moderators.map((mod, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {mod.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{mod.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {mod.role}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
