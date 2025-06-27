import { ChallengeHeader } from "@/components/challenges/challenge-header"
import { ChallengeGrid } from "@/components/challenges/challenge-grid"

export default function ChallengesPage() {
  return (
    <div className="p-6 space-y-6">
      <ChallengeHeader challengeId="your-challenge-id" />
      <ChallengeGrid />
    </div>
  )
}
