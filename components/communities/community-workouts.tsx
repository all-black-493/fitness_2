"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { useCommunityWorkouts } from "@/hooks/use-community-workouts"

interface CommunityWorkoutsProps {
    communityId: string
}

export function CommunityWorkouts({ communityId }: CommunityWorkoutsProps) {
    const { workouts, loading } = useCommunityWorkouts(communityId)

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                    {[...Array(3)].map((_, i) => (
                        <LoadingSkeleton key={i} className="h-14 w-full rounded-lg mb-2" />
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (!workouts.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground text-sm p-4">No workouts found for this community.</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Workouts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="p-4 border rounded-lg flex flex-col gap-1">
                            <div className="font-medium text-lg">{workout.name}</div>
                            {workout.description && <div className="text-sm text-muted-foreground">{workout.description}</div>}
                            {workout.date && <div className="text-xs text-muted-foreground">Date: {workout.date}</div>}
                            {workout.type && <div className="text-xs text-muted-foreground">Type: {workout.type}</div>}
                            {workout.duration && <div className="text-xs text-muted-foreground">Duration: {workout.duration} min</div>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
