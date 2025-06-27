import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Trophy, Calendar, TrendingUp } from "lucide-react"

export function SummaryCards() {
  const cards = [
    {
      title: "Today's Workout",
      value: "Push Day",
      description: "45 min • 8 exercises",
      icon: Dumbbell,
      badge: "Completed",
    },
    {
      title: "Current Challenge",
      value: "30-Day Plank",
      description: "Day 15 of 30",
      icon: Trophy,
      badge: "In Progress",
    },
    {
      title: "Next Session",
      value: "Leg Day",
      description: "Tomorrow at 7:00 AM",
      icon: Calendar,
      badge: "Scheduled",
    },
    {
      title: "Weekly Progress",
      value: "4/5 Workouts",
      description: "80% completion rate",
      icon: TrendingUp,
      badge: "On Track",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            <Badge variant="secondary" className="mt-2">
              {card.badge}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
