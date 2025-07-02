"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPanel } from "@/components/notifications/notifications-panel"
import { toast } from "sonner"
import { logoutAction } from "@/lib/actions/auth"
import {
  Home,
  Dumbbell,
  Trophy,
  Users,
  MessageSquare,
  UserCheck,
  Settings,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Brain,
  ShoppingBag,
  Loader2,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Challenges", href: "/challenges", icon: Trophy },
  { name: "AI Planner", href: "/ai-planner", icon: Brain },
  { name: "Store", href: "/store", icon: ShoppingBag },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Communities", href: "/communities", icon: MessageSquare },
  { name: "Trainers", href: "/trainers", icon: UserCheck },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setProfileError(null)
    startTransition(() => {
      import("@/lib/actions/profile").then(async mod => {
        try {
          const profile = await mod.getCurrentUserProfile()
          if (isMounted) setUserProfile(profile)
        } catch (err: any) {
          if (isMounted) setProfileError(err.message || "Not authenticated")
        }
      })
    })
    return () => { isMounted = false }
  }, [])

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction({})

      if (result?.data?.success) {
        toast.success(result.data.success)
        router.push("/auth/pw-login")
      } else if (result?.data?.error) {
        toast.error(result.data.error)
      }
    })
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FitLogger</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.name === "AI Planner" && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 w-full justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>{userProfile?.username?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      {isPending ? (
                        <p className="text-sm font-medium animate-pulse">Loading...</p>
                      ) : profileError ? (
                        <p className="text-sm text-muted-foreground">Not signed in</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{userProfile?.full_name || userProfile?.username || "User"}</p>
                          <p className="text-xs text-muted-foreground">{userProfile?.email || "No email"}</p>
                        </>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={userProfile ? `/profile/${userProfile.username}` : "/auth/login"}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(true)} className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  )
}
