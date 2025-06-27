import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await middleware(request)

    const mockSettings = {
      profile: {
        name: "John Doe",
        email: "john@example.com",
        bio: "Fitness enthusiast passionate about strength training",
        fitnessGoals: ["Build Muscle", "Improve Endurance"],
      },
      preferences: {
        theme: "system",
        units: "imperial",
        autoSync: true,
        showFriendActivity: true,
      },
      notifications: {
        workoutReminders: true,
        friendActivity: true,
        challengeUpdates: true,
        trainerMessages: true,
        communityPosts: false,
      },
      privacy: {
        publicProfile: true,
        showWorkoutDetails: true,
        activityStatus: false,
        dataSharing: false,
      },
    }

    return successResponse(mockSettings)
  } catch (error) {
    return errorResponse("Failed to fetch settings", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await middleware(request)
    const settingsData = await request.json()

    return successResponse(settingsData, "Settings updated successfully")
  } catch (error) {
    return errorResponse("Failed to update settings", 500)
  }
}
