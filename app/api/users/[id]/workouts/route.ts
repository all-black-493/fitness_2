import type { NextRequest } from "next/server"
import dbConnect from "@/lib/db"
import Workout from "@/lib/models/Workout"
import { WorkoutQuerySchema } from "@/lib/validations/workout"
import { successResponse, errorResponse, handleApiError } from "@/lib/utils/api-response"
import { middleware as getAuthenticatedUser } from "@/lib/middleware/auth"
import mongoose from "mongoose"

interface RouteParams {
  params: {
    id: string
  }
}

// TODO: GET /api/users/[id]/workouts - Get workouts by user ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()

    const authResult = await getAuthenticatedUser(request)
    if ("status" in authResult) {
      // If getAuthenticatedUser returns a NextResponse (error), return it directly
      return authResult
    }
    const currentUser = authResult
    const { id: userId } = params
    const { searchParams } = new URL(request.url)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse("Invalid user ID", 400)
    }

    //TODO: Parse query parameters
    const queryData = WorkoutQuerySchema.parse(Object.fromEntries(searchParams))

    //TODO: Build filter object
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userId),
    }

    //TODO: Add additional filters
    if (queryData.communityId) {
      filter.communityId = new mongoose.Types.ObjectId(queryData.communityId)
    }

    if (queryData.tags) {
      const tags = queryData.tags.split(",").map((tag) => tag.trim())
      filter.tags = { $in: tags }
    }

    if (queryData.startDate || queryData.endDate) {
      filter.date = {}
      if (queryData.startDate) filter.date.$gte = new Date(queryData.startDate)
      if (queryData.endDate) filter.date.$lte = new Date(queryData.endDate)
    }

    // Check privacy - users can see their own workouts or public workouts
    // In a real app, you'd check friendship status, privacy settings, etc.
    const isOwnProfile = userId === currentUser.id

    if (!isOwnProfile) {
      // Add privacy filter for non-own profiles
      // For now, only show workouts posted to communities (public workouts)
      filter.communityId = { $exists: true }
    }

    // Build query with pagination
    const limit = queryData.limit || 20
    const offset = queryData.offset || 0

    const workouts = await Workout.find(filter)
      .populate([
        { path: "userId", select: "name email" },
        { path: "communityId", select: "name" },
        { path: "taggedFriendIds", select: "name email" },
      ])
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset)

    const total = await Workout.countDocuments(filter)

    return successResponse({
      workouts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      isOwnProfile,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(`Validation error: ${error.errors.map((e: any) => e.message).join(", ")}`)
    }
    return handleApiError(error)
  }
}
