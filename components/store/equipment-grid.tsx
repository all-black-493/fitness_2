import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Truck } from "lucide-react"

export function EquipmentGrid() {
  const equipment = [
    {
      id: 1,
      name: "Adjustable Dumbbells Set",
      brand: "Bowflex",
      category: "Weights",
      price: 349.99,
      originalPrice: 399.99,
      rating: 4.7,
      reviews: 1247,
      image: "/placeholder.svg?height=200&width=200",
      description: "5-52.5 lbs per dumbbell, space-saving design",
      features: ["Quick weight changes", "Compact storage", "Durable construction"],
      freeShipping: true,
    },
    {
      id: 2,
      name: "Resistance Bands Set",
      brand: "Bodylastics",
      category: "Resistance",
      price: 39.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 2341,
      image: "/placeholder.svg?height=200&width=200",
      description: "5 bands with varying resistance levels",
      features: ["Snap-guard technology", "Door anchor included", "Lifetime warranty"],
      freeShipping: false,
    },
    {
      id: 3,
      name: "Pull-Up Bar",
      brand: "Perfect Pushup",
      category: "Bodyweight",
      price: 29.99,
      originalPrice: null,
      rating: 4.5,
      reviews: 892,
      image: "/placeholder.svg?height=200&width=200",
      description: "Doorway pull-up bar with multiple grip positions",
      features: ["No screws required", "Foam grips", "Supports up to 300 lbs"],
      freeShipping: false,
    },
    {
      id: 4,
      name: "Kettlebell Set",
      brand: "CAP Barbell",
      category: "Weights",
      price: 159.99,
      originalPrice: 189.99,
      rating: 4.6,
      reviews: 567,
      image: "/placeholder.svg?height=200&width=200",
      description: "Cast iron kettlebells - 15, 25, 35 lbs",
      features: ["Wide handle", "Flat bottom", "Powder-coated finish"],
      freeShipping: true,
    },
    {
      id: 5,
      name: "Yoga Mat Premium",
      brand: "Manduka",
      category: "Yoga",
      price: 89.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 1876,
      image: "/placeholder.svg?height=200&width=200",
      description: "6mm thick, non-slip yoga mat",
      features: ["Lifetime guarantee", "Superior grip", "Eco-friendly"],
      freeShipping: false,
    },
    {
      id: 6,
      name: "Foam Roller",
      brand: "TriggerPoint",
      category: "Recovery",
      price: 49.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 1234,
      image: "/placeholder.svg?height=200&width=200",
      description: "High-density foam roller for muscle recovery",
      features: ["Multi-density surface", "Portable design", "Instructional videos"],
      freeShipping: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.freeShipping && (
                <Badge className="absolute top-2 left-2 bg-green-500">
                  <Truck className="mr-1 h-3 w-3" />
                  Free Shipping
                </Badge>
              )}
              {product.originalPrice && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div>
              <Badge variant="outline" className="text-xs mb-2">
                {product.brand}
              </Badge>
              <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Key Features:</span>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
