import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Target, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

// Dynamic import for server action
const getChallengeActivitiesAction = async (challengeId: string) => 
  (await import("@/lib/actions/challenges")).getChallengeActivities(challengeId)

interface ChallengeActivityProps {
  challengeId: string
}

interface ActivityEntry {
  id: string
  user: string
  avatar: string | null
  action: string
  details: string
  time: string
  type: string
  isCurrentUser: boolean
}

export function ChallengeActivity({ challengeId }: ChallengeActivityProps) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActivity() {
      if (!challengeId) {
        setActivities([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        const data = await getChallengeActivitiesAction(challengeId)
        
        if (!data) {
          setActivities([])
          setLoading(false)
          return
        }
        
        // Map to activity entries
        const entries: ActivityEntry[] = data.map((a: any) => ({
          id: a.id,
          user: a.profile?.display_name || a.profile?.username || "-",
          avatar: a.profile?.avatar_url || null,
          action: a.action || "",
          details: a.details || "",
          time: a.created_at ? new Date(a.created_at).toLocaleString() : "-",
          type: a.type || "progress",
          isCurrentUser: user && a.profile_id === user.id,
        }))
        setActivities(entries)
      } catch (err: any) {
        setError(err.message || "Failed to load activity.")
      } finally {
        setLoading(false)
      }
    }
    
    if (challengeId) fetchActivity()
  }, [challengeId, user?.id])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "milestone":
        return <Target className="h-4 w-4 text-purple-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-14 w-full rounded-lg mb-2" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm p-4" role="alert">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!activities.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm p-4">No recent activity yet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors ${activity.isCurrentUser ? "bg-primary/10 border border-primary/20" : ""}`}
                tabIndex={0}
                aria-label={activity.user}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm">
                      <span className={`font-medium ${activity.isCurrentUser ? "text-primary" : ""}`}>{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    {getActivityIcon(activity.type)}
                  </div>
                  <p className="text-sm font-medium text-primary mt-1">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
