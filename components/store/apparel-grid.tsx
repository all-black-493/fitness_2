import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { getProductsByType } from "@/lib/actions/store"

export async function ApparelGrid() {
  try {
    const apparel = await getProductsByType("apparel")

    if (!apparel || apparel.length === 0) {
      return <div className="text-muted-foreground">No apparel products found.</div>
    }

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
                {product.is_new && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
                {product.original_price && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
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
                    {product.colors?.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sizes:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes?.slice(0, 3).map((size, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                    {product.sizes?.length > 3 && (
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
