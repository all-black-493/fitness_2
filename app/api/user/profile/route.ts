import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await middleware(request)

    const profile = {
      ...user,
      stats: {
        totalWorkouts: 45,
        currentStreak: 7,
        totalFriends: 23,
        communitiesJoined: 5,
        challengesCompleted: 3,
      },
      preferences: {
        units: "imperial",
        privacy: "friends",
        notifications: {
          workoutReminders: true,
          friendActivity: true,
          challengeUpdates: true,
        },
      },
    }

    return successResponse(profile)
  } catch (error) {
    return errorResponse("Failed to fetch profile", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("Updating profile...")

  } catch (error) {
    return errorResponse("Failed to update profile", 500)
  }
}
