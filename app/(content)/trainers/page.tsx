import { TrainersHeader } from "@/components/trainers/trainers-header"
import { TrainersGrid } from "@/components/trainers/trainers-grid"

export default function TrainersPage() {
  return (
    <div className="p-6 space-y-6">
      <TrainersHeader />
      <TrainersGrid />
    </div>
  )
}
