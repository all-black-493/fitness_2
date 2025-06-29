"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, X, Play, Save } from "lucide-react"
import { toast } from "sonner"
import { useWorkouts } from "@/hooks/use-workouts"
import { Database } from "@/database.types"

interface Exercise {
  id: string
  name: string
  type: "strength" | "cardio" | "flexibility" | "bodyweight"
  sets: Array<{
    reps?: number
    weight?: number
    duration?: string
    distance?: number
    completed: boolean
  }>
}

type ExerciseType = Database["public"]["Enums"]["exercise_type"]

const exerciseTypes: Record<ExerciseType, { label: string; metrics: string[] }> = {
  strength: { label: "Strength", metrics: ["reps", "weight"] },
  cardio: { label: "Cardio", metrics: ["duration", "distance"] },
  flexibility: { label: "Flexibility", metrics: ["duration"] },
  bodyweight: { label: "Bodyweight", metrics: ["reps"] },
}


const commonExercises = {
  strength: ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Barbell Row"],
  cardio: ["Running", "Cycling", "Treadmill", "Elliptical", "Rowing"],
  flexibility: ["Yoga", "Stretching", "Pilates", "Foam Rolling"],
  bodyweight: ["Push-ups", "Pull-ups", "Burpees", "Plank", "Mountain Climbers"],
}

const normalizeWorkoutType = (type: string): Database["public"]["Enums"]["workout_type"] => {
  switch (type) {
    case "bodyweight":
      return "strength"
    case "strength":
    case "cardio":
    case "flexibility":
    case "mobility":
    case "hiit":
    case "yoga":
    case "crossfit":
    case "recovery":
    case "general":
      return type
    default:
      return "general"
  }
}


export function QuickWorkoutLogger() {
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { addWorkout } = useWorkouts()
  const [isLogging, setIsLogging] = useState(false)

  const addExercise = (type: "strength" | "cardio" | "flexibility" | "bodyweight") => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      type,
      sets: [{ completed: false }],
    }
    setExercises([...exercises, newExercise])
    toast.success("Exercise added!")
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
    toast.success("Exercise removed")
  }

  const updateExerciseName = (id: string, name: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, name } : ex)))
  }

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { completed: false }] } : ex)),
    )
    toast.success("Set added!")
  }

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) } : ex)),
    )
  }

  const updateSet = (exerciseId: string, setIndex: number, field: string, value: any) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
            ...ex,
            sets: ex.sets.map((set, i) => (i === setIndex ? { ...set, [field]: value } : set)),
          }
          : ex,
      ),
    )
  }

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
            ...ex,
            sets: ex.sets.map((set, i) => (i === setIndex ? { ...set, completed: !set.completed } : set)),
          }
          : ex,
      ),
    )
    toast.success("Set completed! 💪")
  }

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error("Please enter a workout name")
      return
    }
    if (exercises.length === 0) {
      toast.error("Please add at least one exercise")
      return
    }

    setIsLogging(true)
    try {
      await addWorkout({
        name: workoutName,
        exercises: exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.filter((set) => set.completed),
        })),
        tags: Array.from(new Set(exercises.map((ex) => ex.type))),
        workout_date: new Date().toISOString(),

        calories_burned: 0,
        completed: exercises.every((ex) => ex.sets.every((set) => set.completed)),
        duration_minutes: null,
        notes: "",
        type: normalizeWorkoutType(exercises[0]?.type ?? "general"),
      });


      toast.success("Workout saved successfully! 🎉")
      setWorkoutName("")
      setExercises([])
    } catch (error) {
      toast.error("Failed to save workout")
    } finally {
      setIsLogging(false)
    }
  }

  const renderSetInputs = (exercise: Exercise, set: any, setIndex: number) => {
    const metrics = exerciseTypes[exercise.type].metrics

    return (
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1">
          <Badge variant={set.completed ? "default" : "outline"} className="w-full justify-center">
            {setIndex + 1}
          </Badge>
        </div>

        {metrics.includes("reps") && (
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="Reps"
              value={set.reps || ""}
              onChange={(e) => updateSet(exercise.id, setIndex, "reps", Number.parseInt(e.target.value) || 0)}
              className="text-center"
            />
          </div>
        )}

        {metrics.includes("weight") && (
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="Weight"
              value={set.weight || ""}
              onChange={(e) => updateSet(exercise.id, setIndex, "weight", Number.parseInt(e.target.value) || 0)}
              className="text-center"
            />
          </div>
        )}

        {metrics.includes("duration") && (
          <div className="col-span-2">
            <Input
              placeholder="Duration"
              value={set.duration || ""}
              onChange={(e) => updateSet(exercise.id, setIndex, "duration", e.target.value)}
              className="text-center"
            />
          </div>
        )}

        {metrics.includes("distance") && (
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="Distance"
              value={set.distance || ""}
              onChange={(e) => updateSet(exercise.id, setIndex, "distance", Number.parseFloat(e.target.value) || 0)}
              className="text-center"
            />
          </div>
        )}

        <div className="col-span-2">
          <Button
            variant={set.completed ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSetComplete(exercise.id, setIndex)}
            className="w-full"
          >
            ✓
          </Button>
        </div>

        <div className="col-span-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSet(exercise.id, setIndex)}
            disabled={exercise.sets.length === 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>Quick Workout Logger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workout Name */}
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            placeholder="e.g., Upper Body Strength, Morning Run"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </div>

        {/* Exercise Type Buttons */}
        <div className="space-y-2">
          <Label>Add Exercise</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(exerciseTypes).map(([type, config]) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addExercise(type as "strength" | "cardio" | "flexibility" | "bodyweight")}
              >
                <Plus className="mr-1 h-3 w-3" />
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Exercise Header */}
                    <div className="flex items-center space-x-2">
                      <Select value={exercise.name} onValueChange={(value) => updateExerciseName(exercise.id, value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select or type exercise name" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonExercises[exercise.type].map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge variant="secondary">{exerciseTypes[exercise.type].label}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Custom exercise name input */}
                    {!commonExercises[exercise.type].includes(exercise.name) && (
                      <Input
                        placeholder="Enter custom exercise name"
                        value={exercise.name}
                        onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                      />
                    )}

                    {/* Sets Header */}
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-1">Set</div>
                      {exerciseTypes[exercise.type].metrics.includes("reps") && (
                        <div className="col-span-2 text-center">Reps</div>
                      )}
                      {exerciseTypes[exercise.type].metrics.includes("weight") && (
                        <div className="col-span-2 text-center">Weight (lbs)</div>
                      )}
                      {exerciseTypes[exercise.type].metrics.includes("duration") && (
                        <div className="col-span-2 text-center">Duration</div>
                      )}
                      {exerciseTypes[exercise.type].metrics.includes("distance") && (
                        <div className="col-span-2 text-center">Distance</div>
                      )}
                      <div className="col-span-2 text-center">Done</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Sets */}
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex}>{renderSetInputs(exercise, set, setIndex)}</div>
                      ))}
                    </div>

                    {/* Add Set Button */}
                    <Button variant="outline" size="sm" onClick={() => addSet(exercise.id)} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Save Button */}
        {exercises.length > 0 && (
          <Button onClick={saveWorkout} disabled={isLogging} className="w-full" size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isLogging ? "Saving..." : "Save Workout"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
