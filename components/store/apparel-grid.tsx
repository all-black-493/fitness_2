import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"

export function ApparelGrid() {
  const apparel = [
    {
      id: 1,
      name: "FitLogger Performance T-Shirt",
      brand: "FitLogger",
      category: "T-Shirts",
      price: 24.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 342,
      image: "/placeholder.svg?height=200&width=200",
      description: "Moisture-wicking fabric for intense workouts",
      colors: ["Black", "Navy", "Gray", "White"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      new: true,
    },
    {
      id: 2,
      name: "Nike Dri-FIT Training Shorts",
      brand: "Nike",
      category: "Shorts",
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.8,
      reviews: 1247,
      image: "/placeholder.svg?height=200&width=200",
      description: "Lightweight shorts with sweat-wicking technology",
      colors: ["Black", "Navy", "Red"],
      sizes: ["S", "M", "L", "XL"],
      new: false,
    },
    {
      id: 3,
      name: "Under Armour Gym Bag",
      brand: "Under Armour",
      category: "Bags",
      price: 59.99,
      originalPrice: null,
      rating: 4.6,
      reviews: 523,
      image: "/placeholder.svg?height=200&width=200",
      description: "Spacious duffel bag with shoe compartment",
      colors: ["Black", "Gray", "Blue"],
      sizes: ["One Size"],
      new: false,
    },
    {
      id: 4,
      name: "Lifting Wrist Wraps",
      brand: "Rogue Fitness",
      category: "Accessories",
      price: 19.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 876,
      image: "/placeholder.svg?height=200&width=200",
      description: "Heavy-duty wrist support for lifting",
      colors: ["Black", "Red", "Blue"],
      sizes: ['18"', '24"', '30"'],
      new: false,
    },
    {
      id: 5,
      name: "Adidas Training Hoodie",
      brand: "Adidas",
      category: "Hoodies",
      price: 64.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 689,
      image: "/placeholder.svg?height=200&width=200",
      description: "Comfortable hoodie for pre and post workout",
      colors: ["Black", "Gray", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      new: false,
    },
    {
      id: 6,
      name: "Compression Leggings",
      brand: "Lululemon",
      category: "Leggings",
      price: 89.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 1534,
      image: "/placeholder.svg?height=200&width=200",
      description: "High-waisted leggings with side pockets",
      colors: ["Black", "Navy", "Olive", "Purple"],
      sizes: ["XS", "S", "M", "L", "XL"],
      new: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apparel.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-4">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.new && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
              {product.originalPrice && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
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
                <span className="text-sm text-muted-foreground">Colors:</span>
                <div className="flex space-x-1">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                        color === "Black"
                          ? "bg-black"
                          : color === "White"
                            ? "bg-white"
                            : color === "Gray"
                              ? "bg-gray-400"
                              : color === "Navy"
                                ? "bg-blue-900"
                                : color === "Red"
                                  ? "bg-red-500"
                                  : color === "Blue"
                                    ? "bg-blue-500"
                                    : color === "Olive"
                                      ? "bg-green-600"
                                      : "bg-purple-500"
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sizes:</span>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.slice(0, 3).map((size, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {size}
                    </Badge>
                  ))}
                  {product.sizes.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.sizes.length - 3}
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
