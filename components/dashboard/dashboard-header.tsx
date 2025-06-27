import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src="/placeholder.svg?height=64&width=64" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground">Ready to crush your fitness goals today?</p>
      </div>
    </div>
  )
}
