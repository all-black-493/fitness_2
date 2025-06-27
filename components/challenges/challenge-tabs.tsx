"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChallengeLeaderboard } from "./challenge-leaderboard"
import { ChallengeActivity } from "./challenge-activity"
import { ChallengeDetails } from "./challenge-details"
import { ChallengeDiscussion } from "./challenge-discussion"

interface ChallengeTabsProps {
  challengeId: string
}

export function ChallengeTabs({ challengeId }: ChallengeTabsProps) {
  return (
    <Tabs defaultValue="leaderboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
      </TabsList>

      <TabsContent value="leaderboard">
        <ChallengeLeaderboard challengeId={challengeId} />
      </TabsContent>

      <TabsContent value="activity">
        <ChallengeActivity challengeId={challengeId} />
      </TabsContent>

      <TabsContent value="details">
        <ChallengeDetails challengeId={challengeId} />
      </TabsContent>

      <TabsContent value="discussion">
        <ChallengeDiscussion challengeId={challengeId} />
      </TabsContent>
    </Tabs>
  )
}
