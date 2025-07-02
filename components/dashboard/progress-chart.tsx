import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

export function ProgressChart() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const username = authProfile?.username
  const {
    stats,
    loading: profileLoading,
    error: profileError,
  } = useProfile({ username: username || "" })

  if (authLoading || profileLoading) {
    return (
      <LoadingSkeleton className="h-64 w-full rounded-lg" aria-busy="true" aria-live="polite" />
    )
  }

  if (profileError) {
    return (
      <div role="alert" className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
        Failed to load progress chart: {profileError}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-muted-foreground text-sm p-4">No progress data available yet. Start logging workouts!</div>
    )
  }

  const completed = stats.weekly_workouts_completed || 0
  const goal = stats.weekly_workout_goal || 0
  const percent = goal ? Math.round((completed / goal) * 100) : 0

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Progress</CardTitle>
            <Badge variant="outline">This Week</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
            <div className="text-center w-full">
              <div className="text-4xl font-bold text-primary mb-2" aria-live="polite">
                {completed}/{goal}
              </div>
              <p className="text-muted-foreground">Workouts Completed</p>
              <div className="mt-4 w-full bg-secondary rounded-full h-2" aria-label="Progress bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{percent}% of weekly goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
