"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Trophy, Users, Calendar, Heart, MessageCircle } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import React from "react"

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const notificationTypeIcon = {
  like: Heart,
  challenge: Trophy,
  friend: Users,
  booking: Calendar,
  comment: MessageCircle,
}

function getNotificationIcon(type: string) {
  const iconClass = "h-4 w-4"
  switch (type) {
    case "like":
      return <Heart className={`${iconClass} text-red-500`} />
    case "challenge":
      return <Trophy className={`${iconClass} text-yellow-500`} />
    case "friend":
      return <Users className={`${iconClass} text-blue-500`} />
    case "booking":
      return <Calendar className={`${iconClass} text-green-500`} />
    case "comment":
      return <MessageCircle className={`${iconClass} text-purple-500`} />
    default:
      return <Bell className={`${iconClass} text-muted-foreground`} />
  }
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            <Badge variant="secondary">{unreadCount}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => <LoadingSkeleton key={i} className="h-16 w-full rounded-lg" />)
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground text-sm p-4">No notifications yet.</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent/50 ${!notification.is_read ? "bg-accent/30" : ""}`}
                tabIndex={0}
                aria-label={notification.title || notification.type}
              >
                <div className="flex-shrink-0">
                  {notification.avatar_url ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{notification.title?.split(" ")[0][0] || "N"}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title || notification.type}</p>
                  <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                </div>

                {!notification.is_read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full" onClick={markAllAsRead} disabled={unreadCount === 0} aria-disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button variant="ghost" className="w-full">
            View all notifications
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
