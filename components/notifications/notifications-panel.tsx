"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Trophy, Users, Calendar, Heart, MessageCircle } from "lucide-react"

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const notifications = [
    {
      id: 1,
      type: "like",
      title: "Sarah liked your workout",
      message: "Upper Body Strength session",
      time: "5 min ago",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      icon: Heart,
    },
    {
      id: 2,
      type: "challenge",
      title: "Challenge reminder",
      message: "30-Day Plank Challenge - Day 16",
      time: "1 hour ago",
      read: false,
      icon: Trophy,
    },
    {
      id: 3,
      type: "friend",
      title: "New friend request",
      message: "Mike Chen wants to connect",
      time: "2 hours ago",
      read: true,
      avatar: "/placeholder.svg?height=32&width=32",
      icon: Users,
    },
    {
      id: 4,
      type: "booking",
      title: "Session confirmed",
      message: "Training with Sarah Mitchell tomorrow at 7 AM",
      time: "3 hours ago",
      read: true,
      icon: Calendar,
    },
    {
      id: 5,
      type: "comment",
      title: "Emma commented on your post",
      message: '"Great form on those deadlifts! 💪"',
      time: "5 hours ago",
      read: true,
      avatar: "/placeholder.svg?height=32&width=32",
      icon: MessageCircle,
    },
  ]

  const getNotificationIcon = (type: string, IconComponent: any) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "like":
        return <IconComponent className={`${iconClass} text-red-500`} />
      case "challenge":
        return <IconComponent className={`${iconClass} text-yellow-500`} />
      case "friend":
        return <IconComponent className={`${iconClass} text-blue-500`} />
      case "booking":
        return <IconComponent className={`${iconClass} text-green-500`} />
      case "comment":
        return <IconComponent className={`${iconClass} text-purple-500`} />
      default:
        return <Bell className={`${iconClass} text-muted-foreground`} />
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            <Badge variant="secondary">{notifications.filter((n) => !n.read).length}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent/50 ${
                !notification.read ? "bg-accent/30" : ""
              }`}
            >
              <div className="flex-shrink-0">
                {notification.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{notification.title.split(" ")[0][0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                    {getNotificationIcon(notification.type, notification.icon)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>

              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full">
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
