import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Trophy, Users } from "lucide-react"
import { useChallenges } from "@/hooks/use-challenges"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

interface ChallengeDetailsProps {
  challengeId: string
}

export function ChallengeDetails({ challengeId }: ChallengeDetailsProps) {
  const { challenges, loading } = useChallenges()
  const challenge = challenges.find((c) => c.id === challengeId)

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-muted-foreground text-sm p-4">Challenge not found.</div>
    )
  }

  // Example: You may want to fetch or compute these from challenge fields
  const stats = [
    {
      label: "Days",
      value: challenge.duration_days || 30,
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Goal",
      value: challenge.goal || "-",
      icon: Target,
      color: "text-green-500",
    },
    {
      label: "Participants",
      value: challenge.participants_count || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Reward",
      value: challenge.reward || "Badge",
      icon: Trophy,
      color: "text-yellow-500",
    },
  ]

  // Example: Parse rules, schedule, tips from challenge fields if available
  const rules = challenge.rules || []
  const schedule = challenge.schedule || []
  const tips = challenge.tips || []

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Challenge Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-3 bg-accent/50 rounded-lg">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Challenge Rules */}
        {rules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-0.5 text-xs">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule */}
        {schedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((week: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{week.week}</h3>
                      <p className="text-sm text-muted-foreground">{week.description}</p>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {week.target}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips & Advice */}
        {tips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  )
}
