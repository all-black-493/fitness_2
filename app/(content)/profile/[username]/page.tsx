"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useProfile } from "@/hooks/use-profile"
import Image from "next/image"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const {
    profile,
    stats,
    achievements,
    milestones,
    challenges,
    communities,
    recentActivity,
    loading,
    error,
  } = useProfile({ username })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton variant="block" className="h-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="block" className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
        <p className="text-destructive">{error}</p>
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
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name || profile.username}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      ? profile.name.split(" ").map((n) => n[0]).join("")
                      : profile.username[0]}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold">{profile.name || profile.username}</h1>
                  {profile.is_verified && (
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
                    <span>
                      Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                    </span>
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
              <div className="text-2xl font-bold">{stats?.total_workouts ?? 0}</div>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats?.current_streak ?? 0}</div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats?.longest_streak ?? 0}</div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats?.total_distance?.toFixed(1) ?? "0.0"}</div>
              <p className="text-xs text-muted-foreground">km Run</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats?.total_weight ? (stats.total_weight / 1000).toFixed(1) : "0.0"}k</div>
              <p className="text-xs text-muted-foreground">kg Lifted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats?.calories_burned ? (stats.calories_burned / 1000).toFixed(1) : "0.0"}k</div>
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
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              role="list"
              aria-label="Achievements"
            >
              {achievements.length === 0 && (
                <p className="text-muted-foreground" role="status">No achievements yet.</p>
              )}
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  tabIndex={0}
                  role="listitem"
                  aria-label={achievement.title || "Achievement"}
                  className={
                    achievement.unlocked
                      ? "border-primary shadow-md"
                      : "opacity-60 border-dashed"
                  }
                >
                  <CardContent className="pt-6 flex items-start space-x-3">
                    <span
                      className="text-2xl"
                      aria-hidden="true"
                      title={achievement.title || "Achievement icon"}
                    >
                      {achievement.icon || <Trophy className="w-8 h-8 text-yellow-500" />}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg" style={{ color: achievement.unlocked ? undefined : '#888' }}>
                        {achievement.title}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{achievement.description}</div>
                      {achievement.unlocked ? (
                        <Badge variant="success" className="text-xs" aria-label="Unlocked">Unlocked</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs" aria-label="Locked">Locked</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.length === 0 && <p className="text-muted-foreground">No milestones yet.</p>}
              {milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-1">{milestone.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <Progress value={Math.min(100, (milestone.current / milestone.target) * 100)} className="mb-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {milestone.current} / {milestone.target} {milestone.unit}
                      </span>
                      {milestone.completed_at && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.length === 0 && <p className="text-muted-foreground">No challenges yet.</p>}
              {challenges.map((c) => (
                <Card key={c.id || c.challenge_id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-1">{c.challenge?.name || c.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Status: {c.status || c.challenge?.status || "-"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined: {c.joined_at ? new Date(c.joined_at).toLocaleDateString() : "-"}
                      {c.completed_at && (
                        <>
                          <span className="mx-2">|</span>
                          Completed: {new Date(c.completed_at).toLocaleDateString()}
                        </>
                      )}
                      {c.rank && (
                        <>
                          <span className="mx-2">|</span>
                          Rank: {c.rank}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.length === 0 && <p className="text-muted-foreground">No communities joined yet.</p>}
              {communities.map((c) => (
                <Card key={c.id || c.community_id}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-1">{c.community?.name || c.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Role: {c.role || c.community?.role || "member"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined: {c.joined_at ? new Date(c.joined_at).toLocaleDateString() : "-"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-2">
              {recentActivity.length === 0 && <p className="text-muted-foreground">No recent activity.</p>}
              {recentActivity.map((a) => (
                <Card key={a.id}>
                  <CardContent className="pt-4 pb-2 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{a.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {a.timestamp ? new Date(a.timestamp).toLocaleString() : "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}
