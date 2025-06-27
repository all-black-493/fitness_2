import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"

export function SupplementsGrid() {
  const supplements = [
    {
      id: 1,
      name: "Optimum Nutrition Gold Standard Whey",
      brand: "Optimum Nutrition",
      category: "Whey Protein",
      price: 59.99,
      originalPrice: 69.99,
      rating: 4.8,
      reviews: 2847,
      image: "/placeholder.svg?height=200&width=200",
      description: "24g protein, 5.5g BCAAs, 4g glutamine per serving",
      flavors: ["Vanilla", "Chocolate", "Strawberry"],
      sizes: ["2 lbs", "5 lbs", "10 lbs"],
      bestseller: true,
    },
    {
      id: 2,
      name: "Creatine Monohydrate",
      brand: "MuscleTech",
      category: "Creatine",
      price: 24.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 1523,
      image: "/placeholder.svg?height=200&width=200",
      description: "Pure creatine monohydrate for strength and power",
      flavors: ["Unflavored"],
      sizes: ["400g", "1kg"],
      bestseller: false,
    },
    {
      id: 3,
      name: "C4 Original Pre-Workout",
      brand: "Cellucor",
      category: "Pre-Workout",
      price: 34.99,
      originalPrice: 39.99,
      rating: 4.6,
      reviews: 3241,
      image: "/placeholder.svg?height=200&width=200",
      description: "Explosive energy, focus, and pumps",
      flavors: ["Fruit Punch", "Blue Razz", "Watermelon"],
      sizes: ["30 servings", "60 servings"],
      bestseller: true,
    },
    {
      id: 4,
      name: "ZMA Sleep Support",
      brand: "NOW Sports",
      category: "Recovery",
      price: 18.99,
      originalPrice: null,
      rating: 4.5,
      reviews: 892,
      image: "/placeholder.svg?height=200&width=200",
      description: "Zinc, Magnesium & Vitamin B6 for recovery",
      flavors: ["Capsules"],
      sizes: ["90 caps", "180 caps"],
      bestseller: false,
    },
    {
      id: 5,
      name: "Dymatize ISO100 Hydrolyzed",
      brand: "Dymatize",
      category: "Whey Protein",
      price: 79.99,
      originalPrice: 89.99,
      rating: 4.9,
      reviews: 1876,
      image: "/placeholder.svg?height=200&width=200",
      description: "Fast-absorbing hydrolyzed whey isolate",
      flavors: ["Gourmet Chocolate", "Vanilla", "Strawberry"],
      sizes: ["3 lbs", "5 lbs"],
      bestseller: false,
    },
    {
      id: 6,
      name: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      category: "Health",
      price: 42.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 1234,
      image: "/placeholder.svg?height=200&width=200",
      description: "High-quality EPA & DHA for heart health",
      flavors: ["Lemon", "Unflavored"],
      sizes: ["120 softgels", "240 softgels"],
      bestseller: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {supplements.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.bestseller && <Badge className="absolute top-2 left-2 bg-orange-500">Bestseller</Badge>}
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Flavors:</span>
                <div className="flex flex-wrap gap-1">
                  {product.flavors.slice(0, 2).map((flavor, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {flavor}
                    </Badge>
                  ))}
                  {product.flavors.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.flavors.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
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
