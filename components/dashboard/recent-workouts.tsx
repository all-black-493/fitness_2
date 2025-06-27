import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Dumbbell, MoreHorizontal } from "lucide-react"

export function RecentWorkouts() {
  const workouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "Today",
      duration: "45 min",
      exercises: 6,
      sets: 18,
      type: "Strength",
    },
    {
      id: 2,
      name: "Morning Run",
      date: "Yesterday",
      duration: "30 min",
      exercises: 1,
      sets: 0,
      type: "Cardio",
    },
    {
      id: 3,
      name: "Leg Day",
      date: "2 days ago",
      duration: "60 min",
      exercises: 8,
      sets: 24,
      type: "Strength",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Workouts</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{workout.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{workout.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{workout.duration}</span>
                    </div>
                    <span>{workout.exercises} exercises</span>
                    {workout.sets > 0 && <span>{workout.sets} sets</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{workout.type}</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
