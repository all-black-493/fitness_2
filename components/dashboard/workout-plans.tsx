import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap } from "lucide-react"

export function WorkoutPlans() {
  const plans = [
    {
      id: 1,
      name: "Beginner Strength",
      price: 29,
      duration: "4 weeks",
      workouts: 12,
      difficulty: "Beginner",
      features: ["3 workouts/week", "Video guides", "Progress tracking"],
      popular: false,
      icon: Star,
    },
    {
      id: 2,
      name: "HIIT Fat Burn",
      price: 39,
      duration: "6 weeks",
      workouts: 18,
      difficulty: "Intermediate",
      features: ["3 workouts/week", "Nutrition guide", "Live coaching"],
      popular: true,
      icon: Zap,
    },
    {
      id: 3,
      name: "Elite Athlete",
      price: 79,
      duration: "8 weeks",
      workouts: 32,
      difficulty: "Advanced",
      features: ["4 workouts/week", "Personal coach", "Custom meal plans"],
      popular: false,
      icon: Crown,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-4 rounded-lg border ${
              plan.popular ? "border-primary bg-primary/5" : "border-border"
            } relative`}
          >
            {plan.popular && <Badge className="absolute -top-2 left-4 bg-primary">Most Popular</Badge>}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <plan.icon className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.duration} • {plan.workouts} workouts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${plan.price}</div>
                <Badge variant="outline" className="text-xs">
                  {plan.difficulty}
                </Badge>
              </div>
            </div>

            <ul className="space-y-1 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              Get Started
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
