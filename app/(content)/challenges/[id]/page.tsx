import { ChallengeHeader } from "@/components/challenges/challenge-header"
import { ChallengeTabs } from "@/components/challenges/challenge-tabs"

interface ChallengePageProps {
  params: {
    id: string
  }
}

export default function ChallengePage({ params }: ChallengePageProps) {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <ChallengeHeader challengeId={params.id} />
      <ChallengeTabs challengeId={params.id} />
    </div>
  )
}
