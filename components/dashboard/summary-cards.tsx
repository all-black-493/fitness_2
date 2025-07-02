import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Trophy, Calendar, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

export function SummaryCards() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const username = authProfile?.username
  const {
    stats,
    challenges,
    loading: profileLoading,
    error: profileError,
  } = useProfile({ username: username || "" })

  if (authLoading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-live="polite">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (profileError) {
    return (
      <div role="alert" className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
        Failed to load dashboard stats: {profileError}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-muted-foreground text-sm p-4">No stats available yet. Start logging workouts!</div>
    )
  }

  // Example mapping: adjust as needed based on your stats/challenges shape
  const cards = [
    {
      title: "Today's Workout",
      value: stats.todays_workout_name || "-",
      description: stats.todays_workout_summary || "No workout logged today.",
      icon: Dumbbell,
      badge: stats.todays_workout_completed ? "Completed" : "Not Started",
    },
    {
      title: "Current Challenge",
      value: challenges?.[0]?.challenge?.name || "No Active Challenge",
      description: challenges?.[0]?.challenge
        ? `Day ${challenges[0].current_day} of ${challenges[0].challenge.total_days}`
        : "Join a challenge to get started!",
      icon: Trophy,
      badge: challenges?.[0]?.status || "None",
    },
    {
      title: "Next Session",
      value: stats.next_workout_name || "-",
      description: stats.next_workout_time ? `Scheduled for ${stats.next_workout_time}` : "No session scheduled.",
      icon: Calendar,
      badge: stats.next_workout_time ? "Scheduled" : "None",
    },
    {
      title: "Weekly Progress",
      value: `${stats.weekly_workouts_completed || 0}/${stats.weekly_workout_goal || 0} Workouts`,
      description: stats.weekly_workout_goal
        ? `${Math.round(((stats.weekly_workouts_completed || 0) / stats.weekly_workout_goal) * 100)}% completion rate`
        : "Set a weekly goal to track progress!",
      icon: TrendingUp,
      badge: stats.weekly_workouts_completed >= stats.weekly_workout_goal ? "On Track" : "Keep Going",
    },
  ]

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow" tabIndex={0} aria-label={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              <Badge variant="secondary" className="mt-2">
                {card.badge}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </ErrorBoundary>
  )
}
