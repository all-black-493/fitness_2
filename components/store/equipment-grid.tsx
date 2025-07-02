import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Truck } from "lucide-react"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getProductsByType } from "@/lib/actions/store"

export async function EquipmentGrid() {
  try {
    const equipment = await getProductsByType("equipment")

    if (!equipment || equipment.length === 0) {
      return <div className="text-muted-foreground">No equipment products found.</div>
    }

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
                {product.free_shipping && (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    <Truck className="mr-1 h-3 w-3" />
                    Free Shipping
                  </Badge>
                )}
                {product.original_price && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Save ${(product.original_price - product.price).toFixed(2)}
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
                  {product.features?.map((feature, index) => (
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
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
                  )}
                </div>
                <Button size="sm" formAction={addToCartAction}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    return <div role="alert" className="text-destructive">Failed to load products.</div>
  }
}
