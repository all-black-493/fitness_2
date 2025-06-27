import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

const mockActivities = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    action: "completed a workout",
    details: "Upper Body Strength • 45 min • 8 exercises",
    time: "2 hours ago",
    type: "workout",
    likes: 12,
    comments: 3,
    hasLiked: false,
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    action: "joined a challenge",
    details: "30-Day Cardio Challenge",
    time: "4 hours ago",
    type: "challenge",
    likes: 8,
    comments: 1,
    hasLiked: true,
  },
  {
    id: 3,
    user: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    action: "achieved a new PR",
    details: "Deadlift: 185 lbs (+10 lbs)",
    time: "6 hours ago",
    type: "achievement",
    likes: 24,
    comments: 7,
    hasLiked: false,
  },
]
//TODO: Replace with actual database or service calls
export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  return createResponse({
    activities: mockActivities,
    total: mockActivities.length,
  })
}
