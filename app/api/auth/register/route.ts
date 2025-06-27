import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return errorResponse("Name, email and password are required")
    }

    // TODO: User registration
    const mockUser = {
      id: "user_" + Date.now(),
      name,
      email,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    const mockToken = "mock_jwt_token_" + Date.now()

    return successResponse(
      {
        user: mockUser,
        token: mockToken,
      },
      "Registration successful",
    )
  } catch (error) {
    return errorResponse("Registration failed", 400)
  }
}
