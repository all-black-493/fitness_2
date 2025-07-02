"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, X, Users, Loader2 } from "lucide-react"
import { useWorkouts } from "@/hooks/use-workouts"
import { z } from "zod"

interface Exercise {
  id: string
  name: string
  sets: Array<{
    reps?: number
    weight?: number
    distance?: number
    time?: string
  }>
}

interface WorkoutLoggerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WorkoutSchema = z.object({
  name: z.string().min(2, "Workout name is required"),
  workout_date: z.string().min(1, "Date is required"),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, "Exercise name is required"),
        sets: z.array(
          z.object({
            reps: z.number().min(0),
            weight: z.number().min(0).optional(),
            distance: z.number().min(0).optional(),
            time: z.string().optional(),
          })
        ).min(1, "At least one set required"),
      })
    )
    .min(1, "At least one exercise required"),
})

export function WorkoutLoggerDialog({ open, onOpenChange }: WorkoutLoggerDialogProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split("T")[0])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [taggedFriends, setTaggedFriends] = useState<string[]>([])
  const [formError, setFormError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { addWorkout, refreshWorkouts } = useWorkouts()

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: [{ reps: 0, weight: 0 }],
    }
    setExercises([...exercises, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExerciseName = (id: string, name: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, name } : ex)))
  }

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { reps: 0, weight: 0 }] } : ex)),
    )
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

  const handleSave = async () => {
    setFormError("")
    const payload = {
      name: workoutName,
      workout_date: workoutDate,
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: ex.sets.map((set) => ({
          reps: Number(set.reps) || 0,
          weight: Number(set.weight) || 0,
          distance: Number(set.distance) || 0,
          time: set.time || "",
        })),
      })),
    }
    const result = WorkoutSchema.safeParse(payload)
    if (!result.success) {
      setFormError(result.error.errors[0]?.message || "Invalid input")
      return
    }
    setIsSaving(true)
    try {
      await addWorkout({
        name: payload.name,
        workout_date: payload.workout_date,
        exercises: payload.exercises,
        duration_minutes: 0, // You may want to calculate this
        type: "", // You may want to infer or select this
        completed: true,
      })
      await refreshWorkouts()
      onOpenChange(false)
      setWorkoutName("")
      setExercises([])
      setTaggedFriends([])
    } catch (err) {
      setFormError("Failed to save workout. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Workout</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSave()
          }}
          className="space-y-6"
        >
          {/* Workout Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                placeholder="e.g., Upper Body Strength"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                aria-invalid={!!formError && !workoutName}
                aria-describedby={formError && !workoutName ? 'workout-name-error' : undefined}
              />
              {formError && !workoutName && (
                <p id="workout-name-error" className="text-sm text-destructive" aria-live="polite" role="alert">{formError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-date">Date</Label>
              <Input
                id="workout-date"
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                aria-invalid={!!formError && !workoutDate}
                aria-describedby={formError && !workoutDate ? 'workout-date-error' : undefined}
              />
              {formError && !workoutDate && (
                <p id="workout-date-error" className="text-sm text-destructive" aria-live="polite" role="alert">{formError}</p>
              )}
            </div>
          </div>

          {/* Tag Friends */}
          <div className="space-y-2">
            <Label>Tag Friends</Label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Tag Friends
              </Button>
              {taggedFriends.map((friend, index) => (
                <Badge key={index} variant="secondary">
                  {friend}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setTaggedFriends(taggedFriends.filter((_, i) => i !== index))}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Exercises</Label>
              <Button onClick={addExercise} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">No exercises added yet</p>
                  <Button onClick={addExercise} variant="outline" className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Exercise
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, exerciseIndex) => (
                  <Card key={exercise.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Input
                          placeholder="Exercise name (e.g., Bench Press)"
                          value={exercise.name}
                          onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                          className="flex-1 mr-2"
                        />
                        <Button variant="outline" size="sm" onClick={() => removeExercise(exercise.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
                          <span>Set</span>
                          <span>Reps</span>
                          <span>Weight (lbs)</span>
                          <span></span>
                        </div>

                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="grid grid-cols-4 gap-2">
                            <div className="flex items-center justify-center">
                              <Badge variant="outline">{setIndex + 1}</Badge>
                            </div>
                            <Input
                              type="number"
                              placeholder="12"
                              value={set.reps || ""}
                              onChange={(e) =>
                                updateSet(exercise.id, setIndex, "reps", Number.parseInt(e.target.value) || 0)
                              }
                            />
                            <Input
                              type="number"
                              placeholder="135"
                              value={set.weight || ""}
                              onChange={(e) =>
                                updateSet(exercise.id, setIndex, "weight", Number.parseInt(e.target.value) || 0)
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSet(exercise.id, setIndex)}
                              disabled={exercise.sets.length === 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

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
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" placeholder="How did the workout feel? Any observations..." rows={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
