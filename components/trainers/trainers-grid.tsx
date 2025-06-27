import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Bring in the missing DollarSign icon and remove the unused alias import
import { Star, MapPin, Clock, DollarSign } from "lucide-react"

export function TrainersGrid() {
  const trainers = [
    {
      id: 1,
      name: "Sarah Mitchell",
      specialization: "Strength Training",
      rating: 4.9,
      reviews: 127,
      location: "Downtown Gym",
      experience: "8 years",
      price: 75,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["Certified", "NASM"],
      bio: "Specialized in powerlifting and strength building. Helped 200+ clients achieve their strength goals.",
      availability: "Available today",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      specialization: "HIIT & Cardio",
      rating: 4.8,
      reviews: 89,
      location: "FitZone Studio",
      experience: "6 years",
      price: 65,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["Certified", "ACSM"],
      bio: "High-energy trainer focused on fat loss and cardiovascular health. Group and personal sessions available.",
      availability: "Available tomorrow",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialization: "Yoga & Flexibility",
      rating: 5.0,
      reviews: 156,
      location: "Zen Wellness Center",
      experience: "10 years",
      price: 60,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["RYT-500", "Certified"],
      bio: "Experienced yoga instructor specializing in Vinyasa and Hatha yoga. Focus on mindfulness and flexibility.",
      availability: "Available today",
    },
    {
      id: 4,
      name: "David Kim",
      specialization: "Bodybuilding",
      rating: 4.7,
      reviews: 203,
      location: "Iron Paradise Gym",
      experience: "12 years",
      price: 85,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["IFBB Pro", "Certified"],
      bio: "Former competitive bodybuilder. Expert in muscle building, contest prep, and nutrition planning.",
      availability: "Booked until next week",
    },
    {
      id: 5,
      name: "Lisa Chen",
      specialization: "Functional Training",
      rating: 4.9,
      reviews: 94,
      location: "CrossFit Box",
      experience: "7 years",
      price: 70,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["CF-L2", "Certified"],
      bio: "CrossFit Level 2 trainer focusing on functional movements and athletic performance.",
      availability: "Available today",
    },
    {
      id: 6,
      name: "Alex Thompson",
      specialization: "Sports Performance",
      rating: 4.8,
      reviews: 78,
      location: "Athletic Center",
      experience: "9 years",
      price: 80,
      avatar: "/placeholder.svg?height=80&width=80",
      badges: ["CSCS", "Certified"],
      bio: "Sports performance specialist working with athletes and weekend warriors. Injury prevention focus.",
      availability: "Available tomorrow",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer) => (
        <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarImage src={trainer.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{trainer.name}</h3>
              <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
            </div>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{trainer.rating}</span>
              <span className="text-sm text-muted-foreground">({trainer.reviews} reviews)</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-1 justify-center">
              {trainer.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground text-center">{trainer.bio}</p>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{trainer.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{trainer.experience} experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${trainer.price}/session</span>
              </div>
            </div>

            {/* Availability */}
            <div className="text-center">
              <Badge variant={trainer.availability.includes("Available") ? "default" : "secondary"} className="text-xs">
                {trainer.availability}
              </Badge>
            </div>

            {/* Book Button */}
            <Button className="w-full" disabled={trainer.availability.includes("Booked")}>
              {trainer.availability.includes("Booked") ? "Fully Booked" : "Book Session"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
