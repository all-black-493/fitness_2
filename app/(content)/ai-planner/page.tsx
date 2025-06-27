import { AIWorkoutPlanner } from "@/components/ai-workout-planner"

export default function AIWorkoutPlannerPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">AI-Powered Workout Planning</h1>
        <p className="text-muted-foreground text-lg">
          Let artificial intelligence create the perfect workout plan for your goals and lifestyle
        </p>
      </div>

      <AIWorkoutPlanner />
    </div>
  )
}
