"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Calendar,
  Flame,
  Activity,
  MapPin,
  Award,
  TrendingUp,
  MessageSquare,
  UserPlus,
  Share2,
} from "lucide-react"

interface UserProfile {
  id: string
  username: string
  name: string
  avatar: string
  bio?: string
  joinedAt: string
  isVerified: boolean
  stats: {
    totalWorkouts: number
    currentStreak: number
    longestStreak: number
    totalDistance: number
    totalWeight: number
    caloriesBurned: number
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
    category: string
  }>
  milestones: Array<{
    id: string
    name: string
    description: string
    target: number
    current: number
    unit: string
    completedAt?: string
  }>
  challengesParticipated: Array<{
    challengeId: string
    name: string
    status: string
    joinedAt: string
    completedAt?: string
    rank?: number
  }>
  communitiesJoined: Array<{
    communityId: string
    name: string
    role: string
    joinedAt: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: To be replaced with actual API call with a use-profile hook
    const mockProfile: UserProfile = {
      id: "user_123",
      username: username,
      name: "John Doe",
      avatar: "/placeholder.svg?height=120&width=120",
      bio: "Fitness enthusiast 💪 | Marathon runner 🏃‍♂️ | Helping others achieve their goals",
      joinedAt: "2023-01-15",
      isVerified: true,
      stats: {
        totalWorkouts: 156,
        currentStreak: 12,
        longestStreak: 45,
        totalDistance: 1247.5,
        totalWeight: 45680,
        caloriesBurned: 89340,
      },
      achievements: [
        {
          id: "1",
          name: "First Workout",
          description: "Completed your first workout",
          icon: "🎯",
          unlockedAt: "2023-01-16",
          category: "workout",
        },
        {
          id: "2",
          name: "Week Warrior",
          description: "Worked out 7 days in a row",
          icon: "🔥",
          unlockedAt: "2023-02-01",
          category: "streak",
        },
        {
          id: "3",
          name: "Community Builder",
          description: "Joined 5 communities",
          icon: "👥",
          unlockedAt: "2023-03-15",
          category: "social",
        },
        {
          id: "4",
          name: "Challenge Champion",
          description: "Won a fitness challenge",
          icon: "🏆",
          unlockedAt: "2023-04-20",
          category: "challenge",
        },
      ],
      milestones: [
        {
          id: "1",
          name: "Distance Runner",
          description: "Run 1000km total",
          target: 1000,
          current: 847.5,
          unit: "km",
        },
        {
          id: "2",
          name: "Weight Lifter",
          description: "Lift 50,000kg total",
          target: 50000,
          current: 45680,
          unit: "kg",
          completedAt: "2023-11-15",
        },
        {
          id: "3",
          name: "Calorie Burner",
          description: "Burn 100,000 calories",
          target: 100000,
          current: 89340,
          unit: "calories",
        },
      ],
      challengesParticipated: [
        {
          challengeId: "1",
          name: "30-Day Push-up Challenge",
          status: "completed",
          joinedAt: "2023-10-01",
          completedAt: "2023-10-30",
          rank: 3,
        },
        {
          challengeId: "2",
          name: "November Running Challenge",
          status: "active",
          joinedAt: "2023-11-01",
        },
        {
          challengeId: "3",
          name: "Summer Shred Challenge",
          status: "completed",
          joinedAt: "2023-06-01",
          completedAt: "2023-08-31",
          rank: 1,
        },
      ],
      communitiesJoined: [
        {
          communityId: "1",
          name: "Running Enthusiasts",
          role: "member",
          joinedAt: "2023-02-01",
        },
        {
          communityId: "2",
          name: "Strength Training",
          role: "moderator",
          joinedAt: "2023-03-15",
        },
        {
          communityId: "3",
          name: "Yoga & Mindfulness",
          role: "member",
          joinedAt: "2023-05-20",
        },
      ],
      recentActivity: [
        {
          id: "1",
          type: "workout",
          description: "Completed a 45-minute strength training session",
          timestamp: "2023-12-01T10:30:00Z",
        },
        {
          id: "2",
          type: "achievement",
          description: "Unlocked the 'Consistency King' achievement",
          timestamp: "2023-11-30T18:45:00Z",
        },
        {
          id: "3",
          type: "community",
          description: "Posted in Running Enthusiasts community",
          timestamp: "2023-11-29T14:20:00Z",
        },
      ],
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [username])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="text-muted-foreground">The user @{username} does not exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="text-sm">{profile.bio}</p>}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{profile.stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{profile.stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{profile.stats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{profile.stats.totalDistance.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">km Run</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{(profile.stats.totalWeight / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">kg Lifted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{(profile.stats.caloriesBurned / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">Calories</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="space-y-4">
            {profile.milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{milestone.name}</h3>
                    {milestone.completedAt && <Badge variant="default">Completed</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {milestone.current.toLocaleString()} {milestone.unit}
                      </span>
                      <span>
                        {milestone.target.toLocaleString()} {milestone.unit}
                      </span>
                    </div>
                    <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                  </div>
                  {milestone.completedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="space-y-4">
            {profile.challengesParticipated.map((challenge) => (
              <Card key={challenge.challengeId}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{challenge.name}</h3>
                    <Badge variant={challenge.status === "completed" ? "default" : "secondary"}>
                      {challenge.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Joined {new Date(challenge.joinedAt).toLocaleDateString()}</span>
                    {challenge.completedAt && (
                      <span>Completed {new Date(challenge.completedAt).toLocaleDateString()}</span>
                    )}
                    {challenge.rank && (
                      <Badge variant="outline" className="text-xs">
                        #{challenge.rank} Place
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.communitiesJoined.map((community) => (
              <Card key={community.communityId}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{community.name}</h3>
                    <Badge variant={community.role === "moderator" ? "default" : "secondary"}>{community.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(community.joinedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {profile.recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
