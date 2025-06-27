"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WorkoutLoggerDialog } from "./workout-logger-dialog"
import { useState } from "react"

export function WorkoutHeader() {
  const [loggerOpen, setLoggerOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Workouts</h1>
        <p className="text-muted-foreground">Track and log your fitness sessions</p>
      </div>
      <Button onClick={() => setLoggerOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Log Workout
      </Button>
      <WorkoutLoggerDialog open={loggerOpen} onOpenChange={setLoggerOpen} />
    </div>
  )
}
