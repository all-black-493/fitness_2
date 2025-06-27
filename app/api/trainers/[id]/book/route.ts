import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await middleware(request)
    const { date, time, sessionType } = await request.json()

    const booking = {
      id: "booking_" + Date.now(),
      trainerId: params.id,
      date,
      time,
      sessionType,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    return successResponse(booking, "Session booked successfully")
  } catch (error) {
    return errorResponse("Failed to book session", 500)
  }
}
