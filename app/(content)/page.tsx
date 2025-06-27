import { QuickWorkoutLogger } from "@/components/dashboard/quick-workout-logger"
import { TodaysProgress } from "@/components/dashboard/todays-progress"
import { WorkoutPlans } from "@/components/dashboard/workout-plans"
import { LiveStreamSection } from "@/components/dashboard/live-stream-section"
import { RecentWorkouts } from "@/components/dashboard/recent-workouts"

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Main Workout Logger */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">Ready to Log Your Workout?</h1>
        <p className="text-muted-foreground text-lg">Track your exercises, sets, reps, and progress all in one place</p>
      </div>

      <QuickWorkoutLogger />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TodaysProgress />
          <RecentWorkouts />
        </div>
        <div className="space-y-8">
          <LiveStreamSection />
          <WorkoutPlans />
        </div>
      </div>
    </div>
  )
}
