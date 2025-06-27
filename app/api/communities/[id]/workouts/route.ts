import type { NextRequest } from "next/server"
import dbConnect from "@/lib/db"
import Workout from "@/lib/models/Workout"
import { WorkoutQuerySchema } from "@/lib/validations/workout"
import { successResponse, errorResponse, handleApiError } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"
import mongoose from "mongoose"

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/communities/[id]/workouts - Get workouts posted in a community
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect()

    const user = await middleware(request)
    const { id: communityId } = params
    const { searchParams } = new URL(request.url)

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return errorResponse("Invalid community ID", 400)
    }

    // Parse query parameters
    const queryData = WorkoutQuerySchema.parse(Object.fromEntries(searchParams))

    // Build filter object
    const filter: any = {
      communityId: new mongoose.Types.ObjectId(communityId),
    }

    // Add additional filters
    if (queryData.userId) {
      filter.userId = new mongoose.Types.ObjectId(queryData.userId)
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

    // TODO: Verify that the user is a member of this community

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

    // Get community stats
    const stats = await Workout.aggregate([
      { $match: { communityId: new mongoose.Types.ObjectId(communityId) } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          mostUsedTags: { $push: "$tags" },
        },
      },
      {
        $project: {
          totalWorkouts: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          mostUsedTags: {
            $reduce: {
              input: "$mostUsedTags",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
    ])

    return successResponse({
      workouts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      communityStats: stats[0] || {
        totalWorkouts: 0,
        uniqueUsersCount: 0,
        mostUsedTags: [],
      },
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(`Validation error: ${error.errors.map((e: any) => e.message).join(", ")}`)
    }
    return handleApiError(error)
  }
}
