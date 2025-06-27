import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await middleware(request)

    const mockRecentWorkouts = [
      {
        id: "workout_1",
        name: "Upper Body Strength",
        date: new Date().toISOString(),
        duration: 45,
        exercises: 6,
        type: "Strength",
      },
      {
        id: "workout_2",
        name: "HIIT Cardio",
        date: new Date(Date.now() - 86400000).toISOString(),
        duration: 30,
        exercises: 4,
        type: "Cardio",
      },
    ]

    const mockStats = {
      totalWorkouts: 12,
      totalExercises: 48,
      avgWorkoutsPerWeek: 3.5,
      currentStreak: 5,
    }

    return successResponse({
      workouts: mockRecentWorkouts,
      stats: mockStats,
    })
  } catch (error) {
    return errorResponse("Failed to fetch recent workouts", 500)
  }
}
