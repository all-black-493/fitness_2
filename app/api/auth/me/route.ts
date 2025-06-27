import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth/jwt"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return errorResponse("Not authenticated", 401)
    }

    return successResponse(user)
  } catch (error) {
    return errorResponse("Authentication failed", 401)
  }
}
