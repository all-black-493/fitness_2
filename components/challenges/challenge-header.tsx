import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar, Share, Flag } from "lucide-react"

interface ChallengeHeaderProps {
  challengeId: string
}

// TODO: Must come from API. Create useChallenge hook for route handlers to implement here. 
const getChallengeData = (id: string) => {
  const challenges = {
    "1": {
      name: "30-Day Plank Challenge",
      description:
        "Build core strength with daily plank holds. Start with 30 seconds and work your way up to 5 minutes!",
      participants: 156,
      daysLeft: 15,
      totalDays: 30,
      progress: 50,
      isJoined: true,
      difficulty: "Beginner",
      category: "Core",
      creator: "FitLogger Team",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      prize: "Digital Badge + 30% off Premium",
      currentStreak: 7,
      personalBest: "2:45",
      coverImage: "/placeholder.svg?height=200&width=800",
    },
    "2": {
      name: "10K Steps Daily",
      description: "Walk 10,000 steps every day for a month. Track your daily progress and stay consistent!",
      participants: 89,
      daysLeft: 22,
      totalDays: 30,
      progress: 73,
      isJoined: false,
      difficulty: "Easy",
      category: "Cardio",
      creator: "WalkMaster",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      prize: "Fitness Tracker Discount",
      currentStreak: 0,
      personalBest: "12,450 steps",
      coverImage: "/placeholder.svg?height=200&width=800",
    },
  }
  return challenges[id as keyof typeof challenges] || challenges["1"]
}

export function ChallengeHeader({ challengeId }: ChallengeHeaderProps) {
  const challenge = getChallengeData(challengeId)

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 flex items-end space-x-4">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-background">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold">{challenge.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{challenge.participants} participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{challenge.daysLeft} days left</span>
              </div>
              <Badge variant="secondary">{challenge.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <p className="text-muted-foreground text-lg">{challenge.description}</p>

          {challenge.isJoined && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">{challenge.progress}% complete</span>
              </div>
              <Progress value={challenge.progress} className="h-3" />

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{challenge.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(((challenge.totalDays - challenge.daysLeft) / challenge.totalDays) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{challenge.personalBest}</div>
                  <div className="text-xs text-muted-foreground">Personal Best</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Challenge Details */}
          <div className="bg-accent/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Difficulty</span>
              <Badge
                variant={
                  challenge.difficulty === "Easy"
                    ? "secondary"
                    : challenge.difficulty === "Beginner"
                      ? "default"
                      : challenge.difficulty === "Intermediate"
                        ? "destructive"
                        : "destructive"
                }
              >
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <span className="text-sm">{challenge.totalDays} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prize</span>
              <span className="text-sm text-primary">{challenge.prize}</span>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Avatar className="h-6 w-6">
                <AvatarImage src={challenge.creatorAvatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {challenge.creator
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Created by {challenge.creator}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full" variant={challenge.isJoined ? "outline" : "default"} formAction={challenge.isJoined ? leaveChallengeAction : joinChallengeAction}>
              {challenge.isJoined ? "Leave Challenge" : "Join Challenge"}
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Flag className="mr-2 h-4 w-4" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
