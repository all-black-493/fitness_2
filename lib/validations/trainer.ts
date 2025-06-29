import { z } from "zod"

export const becomeTrainerSchema = z.object({
  specialties: z.array(z.string()).min(1, "Must select at least one specialty"),
  hourlyRateKsh: z.number().min(500, "Hourly rate must be at least KSh 500"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000, "Bio must be less than 1000 characters"),
  certifications: z.array(z.string()).optional(),
  experienceYears: z.number().min(0, "Experience cannot be negative"),
})

export const bookSessionSchema = z.object({
  trainerId: z.string().uuid("Invalid trainer ID"),
  title: z.string().min(1, "Session title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().datetime("Invalid date format"),
  durationMinutes: z.number().min(30, "Session must be at least 30 minutes").max(180, "Session cannot exceed 3 hours"),
})

export const rateSessionSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(500, "Comment must be less than 500 characters").optional(),
})

export const updateAvailabilitySchema = z.object({
  availability: z.record(
    z.array(
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    ),
  ),
})

export type BecomeTrainerInput = z.infer<typeof becomeTrainerSchema>
export type BookSessionInput = z.infer<typeof bookSessionSchema>
export type RateSessionInput = z.infer<typeof rateSessionSchema>
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>
