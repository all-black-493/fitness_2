import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const body = await request.json()
    const { fitnessLevel, goals, workoutDays, sessionDuration, equipment, includeNutrition } = body

    if (!fitnessLevel || !goals || goals.length === 0 || !workoutDays) {
      return createErrorResponse("Missing required fields: fitnessLevel, goals, workoutDays")
    }

    // Mock AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockPlan = {
      id: Date.now().toString(),
      userId: user.id,
      fitnessLevel,
      goals,
      workoutDays: Number.parseInt(workoutDays),
      sessionDuration: Number.parseInt(sessionDuration || "45"),
      equipment,
      includeNutrition,
      workouts: [
        {
          day: 1,
          name: "Upper Body Strength",
          duration: 45,
          exercises: [
            {
              name: "Push-ups",
              sets: 3,
              reps: "8-12",
              rest: "60s",
              instructions: "Keep your core tight and maintain a straight line from head to heels.",
            },
            {
              name: "Pull-ups (or Assisted)",
              sets: 3,
              reps: "5-8",
              rest: "90s",
              instructions: "Focus on controlled movement and full range of motion.",
            },
          ],
        },
        {
          day: 2,
          name: "Lower Body Power",
          duration: 45,
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: "12-15",
              rest: "60s",
              instructions: "Keep your chest up and weight in your heels.",
            },
            {
              name: "Lunges",
              sets: 3,
              reps: "10 each leg",
              rest: "60s",
              instructions: "Step forward and lower your hips until both knees are bent at 90 degrees.",
            },
          ],
        },
      ],
      nutritionPlan: includeNutrition
        ? {
            dailyCalories: 2200,
            macros: {
              protein: "25%",
              carbs: "45%",
              fats: "30%",
            },
            meals: [
              {
                name: "Breakfast",
                calories: 550,
                description: "Oatmeal with berries and protein powder",
              },
              {
                name: "Lunch",
                calories: 650,
                description: "Grilled chicken salad with quinoa",
              },
              {
                name: "Dinner",
                calories: 700,
                description: "Salmon with sweet potato and vegetables",
              },
            ],
          }
        : null,
      createdAt: new Date().toISOString(),
    }

    return createResponse(mockPlan, "AI workout plan generated successfully!")
  } catch (error) {
    return createErrorResponse("Invalid request body")
  }
}
