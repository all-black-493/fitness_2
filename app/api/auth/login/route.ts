import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return errorResponse("Email and password are required")
    }

    // Mock authentication
    const mockUser = {
      id: "user_123",
      name: "John Doe",
      email,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    const mockToken = "mock_jwt_token_" + Date.now()

    return successResponse(
      {
        user: mockUser,
        token: mockToken,
      },
      "Login successful",
    )
  } catch (error) {
    return errorResponse("Login failed", 401)
  }
}
