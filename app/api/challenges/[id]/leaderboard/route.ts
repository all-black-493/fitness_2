import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

const mockLeaderboard = [
  {
    rank: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: "4:30",
    streak: 15,
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    score: "4:15",
    streak: 14,
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: "4:00",
    streak: 13,
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    score: "3:45",
    streak: 7,
    isCurrentUser: true,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  return createResponse({
    leaderboard: mockLeaderboard,
    userRank: 4,
    totalParticipants: mockLeaderboard.length,
  })
}
