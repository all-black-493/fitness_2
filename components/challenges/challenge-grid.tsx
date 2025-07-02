"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useChallenges } from "@/hooks/use-challenges"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

export function ChallengeGrid() {
  const { challenges, loading, joinChallenge, refreshChallenges } = useChallenges()
  const [joiningId, setJoiningId] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {challenges.map((challenge: any) => (
        <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center space-x-2">
                  <span>{challenge.title}</span>
                  <Badge variant="outline">{challenge.type}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Challenge Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{challenge.participants_count || 0} joined</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left</span>
                </div>
              </div>
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
                {challenge.difficulty || "Unknown"}
              </Badge>
            </div>

            {/* Progress (optional, if you want to show user progress) */}
            {/*
            {challenge.isJoined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Your Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} />
              </div>
            )}
            */}

            {/* Action Button */}
            {challenge.isJoined ? (
              <Link href={`/challenges/${challenge.id}`}>
                <Button className="w-full" variant="outline">
                  View Challenge
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full"
                variant="default"
                disabled={joiningId === challenge.id}
                formAction={async () => {
                  setJoiningId(challenge.id)
                  try {
                    await joinChallenge(challenge.id)
                    await refreshChallenges()
                  } finally {
                    setJoiningId(null)
                  }
                }}
              >
                {joiningId === challenge.id ? "Joining..." : "Join Challenge"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
