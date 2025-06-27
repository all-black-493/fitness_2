import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Progress</CardTitle>
          <Badge variant="outline">This Week</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-accent/20 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4/5</div>
            <p className="text-muted-foreground">Workouts Completed</p>
            <div className="mt-4 w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">80% of weekly goal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
