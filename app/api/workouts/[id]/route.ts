import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

const mockWorkouts = [
  {
    id: "1",
    userId: "user-123",
    name: "Upper Body Strength",
    date: new Date().toISOString(),
    duration: 45,
    exercises: [
      {
        id: "ex1",
        name: "Bench Press",
        type: "strength" as const,
        sets: [
          { reps: 10, weight: 135, completed: true },
          { reps: 8, weight: 145, completed: true },
        ],
      },
    ],
    tags: ["Upper Body", "Strength"],
    completed: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  const workout = mockWorkouts.find((w) => w.id === params.id && w.userId === user.id)
  if (!workout) {
    return createErrorResponse("Workout not found", 404)
  }

  return createResponse(workout)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const body = await request.json()
    const workoutIndex = mockWorkouts.findIndex((w) => w.id === params.id && w.userId === user.id)

    if (workoutIndex === -1) {
      return createErrorResponse("Workout not found", 404)
    }

    mockWorkouts[workoutIndex] = { ...mockWorkouts[workoutIndex], ...body }

    return createResponse(mockWorkouts[workoutIndex], "Workout updated successfully!")
  } catch (error) {
    return createErrorResponse("Invalid request body")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  const workoutIndex = mockWorkouts.findIndex((w) => w.id === params.id && w.userId === user.id)
  if (workoutIndex === -1) {
    return createErrorResponse("Workout not found", 404)
  }

  mockWorkouts.splice(workoutIndex, 1)

  return createResponse(null, "Workout deleted successfully!")
}
