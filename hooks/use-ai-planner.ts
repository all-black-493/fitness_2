"use client"

import { useState } from "react"
import { useAuth } from "./use-auth"

// Dynamic imports for server actions
const generateAIWorkoutPlanAction = async (request: any) =>
    (await import("@/lib/actions/ai-planner")).generateAIWorkoutPlan(request)
const getUserAIWorkoutPlansAction = async () =>
    (await import("@/lib/actions/ai-planner")).getUserAIWorkoutPlans()
const deleteAIWorkoutPlanAction = async (planId: string) =>
    (await import("@/lib/actions/ai-planner")).deleteAIWorkoutPlan(planId)

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
    const [error, setError] = useState<string | null>(null)
    const [streamingPlan, setStreamingPlan] = useState<string>("")
    const { user } = useAuth()

    const generatePlan = async (request: AIWorkoutPlanRequest) => {
        if (!user) throw new Error("User not authenticated")
        setLoading(true)
        setError(null)
        setStreamingPlan("")

        try {
            const plan = await generateAIWorkoutPlanAction({
                fitnessLevel: request.fitnessLevel,
                goals: request.goals,
                workoutDays: Number(request.workoutDays),
                sessionDuration: Number(request.sessionDuration),
                equipment: request.equipment,
                injuries: request.injuries,
                includeNutrition: request.includeNutrition,
                body_weight: request.body_weight
            })

            setStreamingPlan(plan)
            return plan
        } catch (error: any) {
            setError(error.message || "Failed to generate plan")
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getUserPlans = async () => {
        if (!user) return []
        try {
            return await getUserAIWorkoutPlansAction()
        } catch (error) {
            console.error("Error fetching user plans:", error)
            return []
        }
    }

    const deletePlan = async (planId: string) => {
        if (!user) throw new Error("User not authenticated")
        try {
            await deleteAIWorkoutPlanAction(planId)
        } catch (error: any) {
            setError(error.message || "Failed to delete plan")
            throw error
        }
    }

    return {
        generatePlan,
        getUserPlans,
        deletePlan,
        loading,
        error,
        streamingPlan,
    }
}
