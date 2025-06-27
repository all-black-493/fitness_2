import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await middleware(request)

    const mockFriends = [
      {
        id: "friend_1",
        name: "Sarah Johnson",
        username: "@sarah_fit",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        lastWorkout: "2 hours ago",
        mutualFriends: 12,
      },
      {
        id: "friend_2",
        name: "Mike Chen",
        username: "@mike_gains",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "offline",
        lastWorkout: "Yesterday",
        mutualFriends: 8,
      },
    ]

    return successResponse(mockFriends)
  } catch (error) {
    return errorResponse("Failed to fetch friends", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await middleware(request)
    const { userId } = await request.json()

    return successResponse(null, "Friend request sent successfully")
  } catch (error) {
    return errorResponse("Failed to send friend request", 500)
  }
}
