"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Flame, Trophy } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

export function TodaysProgress() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const username = authProfile?.username
  const {
    stats,
    loading: profileLoading,
    error: profileError,
  } = useProfile({ username: username || "" })

  if (authLoading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (profileError) {
    return (
      <div role="alert" className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
        Failed to load today's progress: {profileError}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-muted-foreground text-sm p-4">No progress data available yet. Start logging workouts!</div>
    )
  }

  const statsArray = [
    {
      label: "Workout Goal",
      current: stats.todays_workout_completed ? 1 : 0,
      target: 1,
      unit: "workout",
      icon: Target,
      color: "text-green-500",
      completed: stats.todays_workout_completed,
    },
    {
      label: "Calories Burned",
      current: stats.todays_calories_burned || 0,
      target: stats.todays_calories_goal || 500,
      unit: "cal",
      icon: Flame,
      color: "text-orange-500",
      completed: (stats.todays_calories_burned || 0) >= (stats.todays_calories_goal || 500),
    },
    {
      label: "Weekly Streak",
      current: stats.weekly_streak || 0,
      target: stats.weekly_streak_goal || 5,
      unit: "days",
      icon: Trophy,
      color: "text-yellow-500",
      completed: (stats.weekly_streak || 0) >= (stats.weekly_streak_goal || 5),
    },
  ]

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsArray.map((stat, index) => {
              const percent = Math.min(100, Math.round((stat.current / stat.target) * 100))
              return (
                <div key={index} className="space-y-3" tabIndex={0} aria-label={stat.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <Badge variant="outline">
                      {stat.current}/{stat.target} {stat.unit}
                    </Badge>
                  </div>
                  <Progress value={percent} className="h-2" aria-label="Progress bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} />
                  <p className="text-xs text-muted-foreground">
                    {stat.completed
                      ? "Goal completed! 🎉"
                      : `${stat.target - stat.current} ${stat.unit} to go`}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
