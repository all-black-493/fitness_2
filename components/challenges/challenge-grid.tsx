"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useChallenges } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export function ChallengeGrid() {
  const { challenges, loading } = useChallenges()

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
                  <span>{challenge.name}</span>
                  <Badge variant="outline">{challenge.category}</Badge>
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
                  <span>{challenge.participants} joined</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{challenge.daysLeft} days left</span>
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
                {challenge.difficulty}
              </Badge>
            </div>

            {/* Progress */}
            {challenge.isJoined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Your Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} />
              </div>
            )}

            {/* Leaderboard Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Leaderboard</h4>
              <div className="space-y-2">
                {challenge.leaderboard.slice(0, 3).map((leader: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {leader.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className={leader.name === "You" ? "font-medium text-primary" : ""}>{leader.name}</span>
                    </div>
                    <span className="font-medium">{leader.time || leader.steps || leader.count || leader.streak}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/challenges/${challenge.id}`}>
              <Button className="w-full" variant={challenge.isJoined ? "outline" : "default"}>
                {challenge.isJoined ? "View Challenge" : "Join Challenge"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
