import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Crown, Shield, MessageCircle } from "lucide-react"

interface CommunityMembersProps {
  communityId: string
}

export function CommunityMembers({ communityId }: CommunityMembersProps) {
  const members = [
    {
      id: 1,
      name: "Coach Johnson",
      username: "@coach_johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "admin",
      joinDate: "Founder",
      posts: 156,
      reputation: 2450,
      status: "online",
    },
    {
      id: 2,
      name: "Mike Strong",
      username: "@mike_strong",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "moderator",
      joinDate: "Jan 2024",
      posts: 89,
      reputation: 1230,
      status: "online",
    },
    {
      id: 3,
      name: "Sarah Lifter",
      username: "@sarah_lifter",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      joinDate: "Mar 2024",
      posts: 45,
      reputation: 680,
      status: "away",
    },
    {
      id: 4,
      name: "Alex Power",
      username: "@alex_power",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      joinDate: "Apr 2024",
      posts: 23,
      reputation: 340,
      status: "offline",
    },
    {
      id: 5,
      name: "Emma Strong",
      username: "@emma_strong",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      joinDate: "May 2024",
      posts: 67,
      reputation: 890,
      status: "online",
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Moderator</Badge>
      default:
        return <Badge variant="outline">Member</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Members */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{member.name}</h3>
                      {getRoleIcon(member.role)}
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.username}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Joined {member.joinDate}</span>
                      <span>{member.posts} posts</span>
                      <span>{member.reputation} reputation</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
