import { AIWorkoutPlanner } from "@/components/ai-workout-planner"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

export default function AIWorkoutPlannerPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">AI-Powered Workout Planning</h1>
        <p className="text-muted-foreground text-lg">
          Let artificial intelligence create the perfect workout plan for your goals and lifestyle
        </p>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton className="w-full max-w-4xl mx-auto h-96" />}>
          <AIWorkoutPlanner />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
