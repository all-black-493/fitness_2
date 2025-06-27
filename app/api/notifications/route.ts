import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await middleware(request)

    const mockNotifications = [
      {
        id: "notif_1",
        type: "like",
        title: "Sarah liked your workout",
        message: "Upper Body Strength session",
        time: "5 min ago",
        read: false,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "notif_2",
        type: "challenge",
        title: "Challenge reminder",
        message: "30-Day Plank Challenge - Day 16",
        time: "1 hour ago",
        read: false,
      },
      {
        id: "notif_3",
        type: "friend",
        title: "New friend request",
        message: "Mike Chen wants to connect",
        time: "2 hours ago",
        read: true,
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ]

    return successResponse(mockNotifications)
  } catch (error) {
    return errorResponse("Failed to fetch notifications", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await middleware(request)
    const { action } = await request.json()

    if (action === "mark_all_read") {
      return successResponse(null, "All notifications marked as read")
    }

    return errorResponse("Invalid action", 400)
  } catch (error) {
    return errorResponse("Failed to update notifications", 500)
  }
}
