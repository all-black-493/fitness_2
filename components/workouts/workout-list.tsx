"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Dumbbell, Users } from "lucide-react"
import { useWorkouts } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkoutList() {
  const { workouts, loading, error } = useWorkouts()

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-red-500 mb-4">Error loading workouts: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start your fitness journey by logging your first workout
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout: any) => (
        <Card key={workout.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>{workout.name}</span>
                <Badge variant={workout.completed ? "default" : "secondary"}>{workout.tags[0] || "Workout"}</Badge>
              </CardTitle>
              {workout.completed && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(workout.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{workout.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Dumbbell className="h-4 w-4" />
                <span>{workout.exercises.length} exercises</span>
              </div>
              {workout.friends && workout.friends.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>with {workout.friends.join(", ")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
