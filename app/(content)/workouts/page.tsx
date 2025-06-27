import { WorkoutHeader } from "@/components/workouts/workout-header"
import { WorkoutList } from "@/components/workouts/workout-list"

export default function WorkoutsPage() {
  return (
    <div className="p-6 space-y-6">
      <WorkoutHeader />
      <WorkoutList />
    </div>
  )
}
