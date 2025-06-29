import { z } from "zod"

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Must have at least 1 set").optional(),
  reps: z.number().min(1, "Must have at least 1 rep").optional(),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  distance: z.number().min(0, "Distance cannot be negative").optional(),
  notes: z.string().optional(),
})

export const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  exercises: z.array(exerciseSchema).min(1, "Must have at least one exercise"),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  caloriesBurned: z.number().min(0, "Calories cannot be negative").optional(),
  notes: z.string().optional(),
  workoutDate: z.string().optional(),
})

export const workoutPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priceKsh: z.number().min(0, "Price cannot be negative"),
  durationWeeks: z.number().min(1, "Duration must be at least 1 week"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  exercises: z.array(exerciseSchema).min(1, "Must have at least one exercise"),
})

export const aiWorkoutRequestSchema = z.object({
  goals: z.array(z.string()).min(1, "Must select at least one goal"),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  workoutDays: z
    .number()
    .min(1, "Must workout at least 1 day per week")
    .max(7, "Cannot workout more than 7 days per week"),
  sessionDuration: z.number().min(15, "Session must be at least 15 minutes").max(180, "Session cannot exceed 3 hours"),
  equipment: z.array(z.string()).optional(),
  includeNutrition: z.boolean().optional(),
})

export type Exercise = z.infer<typeof exerciseSchema>
export type WorkoutInput = z.infer<typeof workoutSchema>
export type WorkoutPlanInput = z.infer<typeof workoutPlanSchema>
export type AIWorkoutRequest = z.infer<typeof aiWorkoutRequestSchema>
