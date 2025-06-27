import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Flame, Trophy } from "lucide-react"

export function TodaysProgress() {
  const stats = [
    {
      label: "Workout Goal",
      current: 1,
      target: 1,
      unit: "workout",
      icon: Target,
      color: "text-green-500",
    },
    {
      label: "Calories Burned",
      current: 320,
      target: 500,
      unit: "cal",
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Weekly Streak",
      current: 4,
      target: 5,
      unit: "days",
      icon: Trophy,
      color: "text-yellow-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <Badge variant="outline">
                  {stat.current}/{stat.target} {stat.unit}
                </Badge>
              </div>
              <Progress value={(stat.current / stat.target) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stat.target - stat.current > 0
                  ? `${stat.target - stat.current} ${stat.unit} to go`
                  : "Goal completed! 🎉"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
