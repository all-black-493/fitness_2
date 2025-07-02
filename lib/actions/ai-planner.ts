"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { openai } from "@/lib/ai/openai"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface AIWorkoutPlanRequest {
    fitnessLevel: string
    goals: string[]
    workoutDays: number
    sessionDuration: number
    equipment: string[]
    injuries?: string
    includeNutrition: boolean
    body_weight?: number
    age?: number
    height?: number
}

export async function generateAIWorkoutPlan(request: AIWorkoutPlanRequest) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        const systemPrompt = `You are an expert fitness trainer and nutritionist. Create a comprehensive, personalized workout plan based on the user's profile.

Key Requirements:
- Provide detailed, actionable workout plans
- Include specific exercises with sets, reps, and rest periods
- Consider the user's fitness level, goals, and available equipment
- Make recommendations realistic and progressive
- Include warm-up and cool-down routines
- Provide form tips and safety considerations

Format the response in Markdown with clear sections:
1. **Overview** - Summary of the plan
2. **Weekly Schedule** - Day-by-day breakdown
3. **Exercises** - Detailed exercise descriptions
4. **Progression Plan** - How to advance over time
5. **Nutrition Guidelines** (if requested)
6. **Safety Tips** - Important considerations

User Profile:
- Fitness Level: ${request.fitnessLevel}
- Goals: ${request.goals.join(", ")}
- Workout Days: ${request.workoutDays} days per week
- Session Duration: ${request.sessionDuration} minutes
- Available Equipment: ${request.equipment.join(", ")}
- Injuries/Limitations: ${request.injuries || "None"}
- Body Weight: ${request.body_weight || "Not specified"} kg
- Age: ${request.age || "Not specified"}
- Height: ${request.height || "Not specified"}

${request.includeNutrition ? "Include a comprehensive nutrition plan with meal suggestions, macronutrient targets, and hydration guidelines." : ""}

Make the plan engaging, motivating, and scientifically sound.`

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: "Generate my personalized workout plan"
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: false
        })

        const generatedPlan = response.choices[0]?.message?.content
        if (!generatedPlan) {
            throw new Error("Failed to generate workout plan")
        }

        // Save the generated plan to database
        const { error: saveError } = await supabase
            .from("ai_workout_plans")
            .insert({
                profile_id: user.id,
                fitness_level: request.fitnessLevel,
                goals: request.goals,
                workout_days: request.workoutDays,
                session_duration: request.sessionDuration,
                equipment: request.equipment,
                injuries_limitations: request.injuries || null,
                nutrition_plan: request.includeNutrition ? generatedPlan : null,
                body_weight: request.body_weight || null,
                generated_plan: generatedPlan
            })

        if (saveError) {
            console.error("Error saving plan:", saveError)
            // Don't throw here, the plan was generated successfully
        }

        revalidatePath("/ai-planner")
        return generatedPlan

    } catch (error) {
        console.error("AI Plan generation error:", error)
        throw new Error("Failed to generate workout plan. Please try again.")
    }
}

export async function getUserAIWorkoutPlans() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data: plans, error } = await supabase
        .from("ai_workout_plans")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        throw new Error("Failed to fetch workout plans")
    }

    return plans || []
}

export async function deleteAIWorkoutPlan(planId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    // Check if user owns the plan
    const { data: plan } = await supabase
        .from("ai_workout_plans")
        .select("id")
        .eq("id", planId)
        .eq("profile_id", user.id)
        .single()

    if (!plan) {
        throw new Error("Plan not found or not authorized")
    }

    const { error } = await supabase
        .from("ai_workout_plans")
        .delete()
        .eq("id", planId)
        .eq("profile_id", user.id)

    if (error) {
        console.error("Error deleting AI workout plan:", error)
        throw new Error("Failed to delete AI workout plan")
    }

    revalidatePath("/ai-planner")
    return { success: true }
}

export async function saveAIWorkoutPlan(planData: {
    fitness_level: string
    goals: string[]
    workout_days: number
    session_duration: number
    equipment: string[]
    injuries_limitations?: string | null
    nutrition_plan: boolean
    body_weight?: number | null
    generated_plan: string
}) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("ai_workout_plans")
        .insert({
            profile_id: user.id,
            ...planData,
        })
        .select()
        .single()

    if (error) {
        console.error("Error saving AI workout plan:", error)
        throw new Error("Failed to save AI workout plan")
    }

    revalidatePath("/ai-planner")
    return data
} 