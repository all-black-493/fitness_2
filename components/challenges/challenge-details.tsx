import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Trophy, Users } from "lucide-react"

interface ChallengeDetailsProps {
  challengeId: string
}

export function ChallengeDetails({ challengeId }: ChallengeDetailsProps) {
  const challengeDetails = {
    description: "Build core strength with daily plank holds. Start with 30 seconds and work your way up to 5 minutes!",
    rules: [
      "Hold a plank position for the required time each day",
      "Log your daily plank time in the app",
      "Take rest days if needed, but try to maintain consistency",
      "Proper form is more important than duration",
    ],
    schedule: [
      { week: "Week 1", target: "30-60 seconds", description: "Build the foundation" },
      { week: "Week 2", target: "1-2 minutes", description: "Increase endurance" },
      { week: "Week 3", target: "2-3 minutes", description: "Push your limits" },
      { week: "Week 4", target: "3-5 minutes", description: "Master the plank" },
    ],
    tips: [
      "Keep your body in a straight line from head to heels",
      "Engage your core muscles throughout the hold",
      "Breathe normally, don't hold your breath",
      "Start with shorter holds and gradually increase time",
      "Focus on quality over quantity",
    ],
  }

  return (
    <div className="space-y-6">
      {/* Challenge Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Challenge Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{challengeDetails.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">30</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold">5min</div>
              <div className="text-xs text-muted-foreground">Goal</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">156</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-lg font-bold">Badge</div>
              <div className="text-xs text-muted-foreground">Reward</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Rules & Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challengeDetails.rules.map((rule, index) => (
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

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challengeDetails.schedule.map((week, index) => (
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

      {/* Tips & Advice */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challengeDetails.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
