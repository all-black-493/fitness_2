import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"


interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await middleware(request)

    const mockChallenge = {
      id: params.id,
      name: "30-Day Plank Challenge",
      description:
        "Build core strength with daily plank holds. Start with 30 seconds and work your way up to 5 minutes!",
      participants: 156,
      daysLeft: 15,
      totalDays: 30,
      progress: 50,
      isJoined: true,
      difficulty: "Beginner",
      category: "Core",
      creator: "FitLogger Team",
      prize: "Digital Badge + 30% off Premium",
      currentStreak: 7,
      personalBest: "2:45",
      createdAt: new Date().toISOString(),
    }

    return successResponse(mockChallenge)
  } catch (error) {
    return errorResponse("Challenge not found", 404)
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await middleware(request)
    const { action } = await request.json()

    if (action === "join") {
      return successResponse(null, "Joined challenge successfully")
    } else if (action === "leave") {
      return successResponse(null, "Left challenge successfully")
    }

    return errorResponse("Invalid action", 400)
  } catch (error) {
    return errorResponse("Failed to update challenge participation", 500)
  }
}
