"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./use-auth"

interface AIWorkoutPlanRequest {
    fitnessLevel: string
    goals: string[]
    workoutDays: string
    sessionDuration: string
    equipment: string[]
    injuries: string
    includeNutrition: boolean
    body_weight: number
}

export function useAIPlanner() {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const supabase = createClient()

    const generatePlan = async (request: AIWorkoutPlanRequest) => {
        if (!user) throw new Error("User not authenticated")

        setLoading(true)
        try {
            // Generate mock AI response (in real app, this would call an AI service)
            const mockPlan = {
                fitnessLevel: request.fitnessLevel,
                workoutDays: request.workoutDays,
                sessionDuration: request.sessionDuration,
                workouts: generateMockWorkouts(request),
                nutritionPlan: request.includeNutrition ? generateMockNutrition(request) : null,
            }

            const { data: planData, error: planError } = await supabase
                .from("ai_workout_plans")
                .insert({
                    profile_id: user.id,
                    fitness_level: request.fitnessLevel,
                    goals: request.goals,
                    workout_days: Number.parseInt(request.workoutDays),
                    session_duration: Number.parseInt(request.sessionDuration),
                    equipment: request.equipment,
                    injuries_limitations: request.injuries || null,
                    nutrition_plan: request.includeNutrition,
                    body_weight: request.body_weight || null,
                    generated_plan: mockPlan,
                })
                .select()
                .single()

            if (planError) throw planError

            return {
                id: planData.id,
                ...mockPlan,
            }
        } catch (error) {
            console.error("Error generating AI plan:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getUserPlans = async () => {
        if (!user) return []

        try {
            const { data, error } = await supabase
                .from("ai_workout_plans")
                .select("*")
                .eq("profile_id", user.id)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data || []
        } catch (error) {
            console.error("Error fetching user plans:", error)
            return []
        }
    }

    return {
        generatePlan,
        getUserPlans,
        loading,
    }
}

function generateMockWorkouts(request: AIWorkoutPlanRequest) {
    const workoutDays = Number.parseInt(request.workoutDays)
    const workouts = []

    for (let i = 1; i <= workoutDays; i++) {
        workouts.push({
            day: i,
            name: `Day ${i} - ${getWorkoutType(i, request.goals)}`,
            duration: request.sessionDuration,
            exercises: generateMockExercises(request.fitnessLevel, request.equipment),
        })
    }

    return workouts
}

function getWorkoutType(day: number, goals: string[]) {
    const types = ["Upper Body", "Lower Body", "Full Body", "Cardio", "Core & Flexibility"]
    if (goals.includes("strength")) return types[day % 3]
    if (goals.includes("endurance")) return "Cardio & Conditioning"
    return types[day % types.length]
}

function generateMockExercises(fitnessLevel: string, equipment: string[]) {
    const exercises = [
        {
            name: "Push-ups",
            sets: fitnessLevel === "beginner" ? "2" : fitnessLevel === "intermediate" ? "3" : "4",
            reps: fitnessLevel === "beginner" ? "8-10" : fitnessLevel === "intermediate" ? "12-15" : "15-20",
            rest: "60 seconds",
            instructions: "Keep your body in a straight line from head to heels.",
        },
        {
            name: "Squats",
            sets: fitnessLevel === "beginner" ? "2" : fitnessLevel === "intermediate" ? "3" : "4",
            reps: fitnessLevel === "beginner" ? "10-12" : fitnessLevel === "intermediate" ? "15-18" : "20-25",
            rest: "60 seconds",
            instructions: "Lower until thighs are parallel to the floor.",
        },
    ]

    if (equipment.includes("Dumbbells")) {
        exercises.push({
            name: "Dumbbell Rows",
            sets: fitnessLevel === "beginner" ? "2" : "3",
            reps: "10-12",
            rest: "60 seconds",
            instructions: "Pull the weight to your lower chest, squeezing shoulder blades.",
        })
    }

    return exercises
}

function generateMockNutrition(request: AIWorkoutPlanRequest) {
    const baseCalories = 2000
    const weightFactor = request.body_weight ? request.body_weight * 12 : 0
    const dailyCalories = baseCalories + weightFactor

    return {
        dailyCalories: dailyCalories.toString(),
        macros: {
            protein: `${Math.round((dailyCalories * 0.3) / 4)}g`,
            carbs: `${Math.round((dailyCalories * 0.4) / 4)}g`,
            fats: `${Math.round((dailyCalories * 0.3) / 9)}g`,
        },
        meals: [
            {
                name: "Breakfast",
                description: "Oatmeal with berries and protein powder",
                calories: "400",
            },
            {
                name: "Lunch",
                description: "Grilled chicken salad with quinoa",
                calories: "500",
            },
            {
                name: "Dinner",
                description: "Salmon with sweet potato and vegetables",
                calories: "600",
            },
        ],
    }
}
