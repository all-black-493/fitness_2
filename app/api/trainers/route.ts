import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware as validateAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await validateAuth(request)

    const mockTrainers = [
      {
        id: "trainer_1",
        name: "Sarah Mitchell",
        specialization: "Strength Training",
        rating: 4.9,
        reviews: 127,
        location: "Downtown Gym",
        experience: "8 years",
        price: 75,
        avatar: "/placeholder.svg?height=80&width=80",
        availability: "Available today",
      },
      {
        id: "trainer_2",
        name: "Marcus Johnson",
        specialization: "HIIT & Cardio",
        rating: 4.8,
        reviews: 89,
        location: "FitZone Studio",
        experience: "6 years",
        price: 65,
        avatar: "/placeholder.svg?height=80&width=80",
        availability: "Available tomorrow",
      },
    ]

    return successResponse(mockTrainers)
  } catch (error) {
    return errorResponse("Failed to fetch trainers", 500)
  }
}
