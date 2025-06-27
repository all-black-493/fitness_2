import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star, Users, TrendingUp } from "lucide-react"

export function SponsorsSection() {
  const sponsors = [
    {
      id: 1,
      name: "Optimum Nutrition",
      logo: "/placeholder.svg?height=80&width=120",
      description: "World's leading sports nutrition brand",
      category: "Supplements",
      partnership: "Premium Partner",
      discount: "20% OFF",
      code: "FITLOGGER20",
      website: "https://optimumnutrition.com",
      products: ["Whey Protein", "Pre-Workout", "Vitamins"],
      rating: 4.8,
      customers: "2M+",
    },
    {
      id: 2,
      name: "Nike Training",
      logo: "/placeholder.svg?height=80&width=120",
      description: "Just Do It - Premium athletic wear",
      category: "Apparel",
      partnership: "Official Partner",
      discount: "15% OFF",
      code: "NIKE15",
      website: "https://nike.com/training",
      products: ["Training Shoes", "Apparel", "Equipment"],
      rating: 4.9,
      customers: "10M+",
    },
    {
      id: 3,
      name: "MyFitnessPal",
      logo: "/placeholder.svg?height=80&width=120",
      description: "Track nutrition and reach your goals",
      category: "Nutrition Tracking",
      partnership: "Technology Partner",
      discount: "30 Days Free",
      code: "FITLOGGER30",
      website: "https://myfitnesspal.com",
      products: ["Premium App", "Nutrition Database", "Meal Planning"],
      rating: 4.7,
      customers: "5M+",
    },
    {
      id: 4,
      name: "Rogue Fitness",
      logo: "/placeholder.svg?height=80&width=120",
      description: "Professional-grade fitness equipment",
      category: "Equipment",
      partnership: "Equipment Partner",
      discount: "10% OFF",
      code: "ROGUE10",
      website: "https://roguefitness.com",
      products: ["Barbells", "Plates", "Racks"],
      rating: 4.9,
      customers: "500K+",
    },
    {
      id: 5,
      name: "Whoop",
      logo: "/placeholder.svg?height=80&width=120",
      description: "Advanced fitness and health monitoring",
      category: "Wearables",
      partnership: "Technology Partner",
      discount: "First Month Free",
      code: "WHOOP1",
      website: "https://whoop.com",
      products: ["Fitness Tracker", "Health Analytics", "Recovery Insights"],
      rating: 4.6,
      customers: "1M+",
    },
    {
      id: 6,
      name: "Peloton",
      logo: "/placeholder.svg?height=80&width=120",
      description: "Connected fitness experiences",
      category: "Digital Fitness",
      partnership: "Content Partner",
      discount: "2 Months Free",
      code: "PELOTON2",
      website: "https://peloton.com",
      products: ["Digital App", "Live Classes", "On-Demand Workouts"],
      rating: 4.5,
      customers: "3M+",
    },
  ]

  const partnershipLevels = {
    "Premium Partner": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "Official Partner": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Technology Partner": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "Equipment Partner": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Content Partner": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Our Trusted Partners</h2>
        <p className="text-muted-foreground">Exclusive deals and partnerships with leading fitness brands</p>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={`${sponsor.name} logo`}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <CardTitle className="text-lg">{sponsor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{sponsor.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Partnership Level */}
              <div className="flex justify-center">
                <Badge className={partnershipLevels[sponsor.partnership as keyof typeof partnershipLevels]}>
                  {sponsor.partnership}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{sponsor.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{sponsor.customers}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Customers</p>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Popular Products:</p>
                <div className="flex flex-wrap gap-1">
                  {sponsor.products.map((product, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Discount Offer */}
              <div className="bg-accent/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">{sponsor.discount}</div>
                <div className="text-sm text-muted-foreground">Use code: {sponsor.code}</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Deals
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partnership CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Become a Partner</h3>
          <p className="text-muted-foreground mb-4">
            Join our network of trusted fitness brands and reach millions of active users
          </p>
          <Button size="lg">Apply for Partnership</Button>
        </CardContent>
      </Card>
    </div>
  )
}
