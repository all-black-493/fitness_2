import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

const mockCommunities = [
  {
    id: "1",
    name: "Strength Training Hub",
    description: "A community for powerlifters and strength enthusiasts",
    members: 1247,
    posts: 89,
    category: "Strength",
    isJoined: true,
    avatar: "/placeholder.svg?height=60&width=60",
    recentPost: {
      author: "Mike Strong",
      content: "Just hit a new PR on deadlift! 405lbs 💪",
      time: "2 hours ago",
      likes: 23,
    },
  },
  {
    id: "2",
    name: "Running Enthusiasts",
    description: "Share your runs, races, and running tips",
    members: 892,
    posts: 156,
    category: "Cardio",
    isJoined: false,
    avatar: "/placeholder.svg?height=60&width=60",
    recentPost: {
      author: "Sarah Runner",
      content: "Beautiful morning run through the park. 5 miles done! 🏃‍♀️",
      time: "4 hours ago",
      likes: 18,
    },
  },
]

//TODO: Replace with actual database or service calls
export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  return createResponse({
    communities: mockCommunities,
    total: mockCommunities.length,
  })
}
