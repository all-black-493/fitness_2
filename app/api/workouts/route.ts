import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse, getQueryParams } from "@/lib/utils/api-helpers"

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
          { reps: 6, weight: 155, completed: true },
        ],
      },
      {
        id: "ex2",
        name: "Pull-ups",
        type: "bodyweight" as const,
        sets: [
          { reps: 8, completed: true },
          { reps: 6, completed: true },
          { reps: 5, completed: true },
        ],
      },
    ],
    tags: ["Upper Body", "Strength"],
    notes: "Great workout, felt strong today!",
    friends: ["Sarah", "Mike"],
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user-123",
    name: "Morning Run",
    date: new Date(Date.now() - 86400000).toISOString(),
    duration: 30,
    exercises: [
      {
        id: "ex3",
        name: "Running",
        type: "cardio" as const,
        sets: [{ duration: "30:00", distance: 3.5, completed: true }],
      },
    ],
    tags: ["Cardio", "Running"],
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  const { limit, offset, tags } = getQueryParams(request)

  let filteredWorkouts = mockWorkouts.filter((w) => w.userId === user.id)

  if (tags.length > 0) {
    filteredWorkouts = filteredWorkouts.filter((w) => w.tags.some((tag) => tags.includes(tag)))
  }

  const paginatedWorkouts = filteredWorkouts.slice(offset, offset + limit)

  return createResponse({
    workouts: paginatedWorkouts,
    total: filteredWorkouts.length,
    hasMore: offset + limit < filteredWorkouts.length,
  })
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const body = await request.json()
    const { name, date, exercises, tags, notes, friends } = body

    if (!name || !exercises || exercises.length === 0) {
      return createErrorResponse("Name and exercises are required")
    }

    const newWorkout = {
      id: Date.now().toString(),
      userId: user.id,
      name,
      date: date || new Date().toISOString(),
      duration: 0, // Calculate from exercises
      exercises: exercises.map((ex: any, index: number) => ({
        id: `ex${Date.now()}-${index}`,
        ...ex,
      })),
      tags: tags || [],
      notes,
      friends: friends || [],
      completed: true,
      createdAt: new Date().toISOString(),
    }

    mockWorkouts.unshift(newWorkout)

    return createResponse(newWorkout, "Workout logged successfully!")
  } catch (error) {
    return createErrorResponse("Invalid request body")
  }
}
