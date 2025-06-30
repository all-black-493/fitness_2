"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { useFriendSuggestions } from "@/hooks/use-friend-suggestions"
import { useAuth } from "@/hooks/use-auth"
import { sendFriendRequest } from "@/lib/mutations/send-friend-request"
import { useState } from "react"

export function FriendSuggestions() {
    const { suggestions, loading } = useFriendSuggestions()
    const { user } = useAuth()
    const [sendingIds, setSendingIds] = useState<string[]>([])
    const [requestedIds, setRequestedIds] = useState<string[]>([])


    const handleAddFriend = async (friendId: string) => {
        if (!user?.id) return
        setSendingIds((prev) => [...prev, friendId])

        const { success } = await sendFriendRequest(user.id, friendId)

        if (success) {
            setRequestedIds((prev) => [...prev, friendId])
        }

        setSendingIds((prev) => prev.filter((id) => id !== friendId))
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Suggested Friends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <p className="text-muted-foreground">Loading suggestions...</p>
                ) : suggestions.length === 0 ? (
                    <p className="text-muted-foreground">No suggestions at the moment</p>
                ) : (
                    suggestions.map((profile) => (
                        <div key={profile.id} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                                    <AvatarFallback>
                                        {profile.display_name?.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{profile.display_name}</span>
                                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant={requestedIds.includes(profile.id) ? "outline" : "default"}
                                disabled={sendingIds.includes(profile.id) || requestedIds.includes(profile.id)}
                                className={requestedIds.includes(profile.id) ? "text-muted-foreground cursor-default" : ""}
                                onClick={() => handleAddFriend(profile.id)}
                            >
                                {requestedIds.includes(profile.id) ? (
                                    <>
                                        ✅ Sent
                                    </>
                                ) : sendingIds.includes(profile.id) ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-1" />
                                        Add
                                    </>
                                )}
                            </Button>

                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
