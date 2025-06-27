import { z } from "zod"

const ExerciseSetSchema = z.object({
  reps: z.number().optional(),
  weight: z.number().optional(),
  time: z.string().optional(),
  distance: z.number().optional(),
})

const ExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.array(ExerciseSetSchema).min(1, "At least one set is required"),
})

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(100, "Workout name too long"),
  date: z.string().datetime().or(z.date()),
  exercises: z.array(ExerciseSchema).min(1, "At least one exercise is required"),
  communityId: z.string().optional(),
  taggedFriendIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export const UpdateWorkoutSchema = CreateWorkoutSchema.partial()

export const WorkoutQuerySchema = z.object({
  userId: z.string().optional(),
  communityId: z.string().optional(),
  tags: z.string().optional(), // comma-separated tags
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})
