import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

// TODO: Replace with actual database or service calls
const mockChallenges = [
  {
    id: "1",
    name: "30-Day Plank Challenge",
    description: "Build core strength with daily plank holds",
    participants: 156,
    daysLeft: 15,
    progress: 50,
    isJoined: true,
    difficulty: "Beginner",
    category: "Core",
    leaderboard: [
      { name: "Sarah J.", time: "4:30", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Mike C.", time: "4:15", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "You", time: "3:45", avatar: "/placeholder.svg?height=24&width=24" },
    ],
  },
  {
    id: "2",
    name: "10K Steps Daily",
    description: "Walk 10,000 steps every day for a month",
    participants: 89,
    daysLeft: 22,
    progress: 73,
    isJoined: false,
    difficulty: "Easy",
    category: "Cardio",
    leaderboard: [
      { name: "Emma W.", steps: "12,450", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Alex R.", steps: "11,890", avatar: "/placeholder.svg?height=24&width=24" },
      { name: "Lisa M.", steps: "11,230", avatar: "/placeholder.svg?height=24&width=24" },
    ],
  },
]

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  return createResponse({
    challenges: mockChallenges,
    total: mockChallenges.length,
  })
}
