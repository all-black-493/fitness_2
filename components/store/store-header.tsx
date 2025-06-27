import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ShoppingCart } from "lucide-react"

export function StoreHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FitStore</h1>
          <p className="text-muted-foreground">Premium supplements, gear, and apparel for your fitness journey</p>
        </div>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          <Badge className="ml-2">3</Badge>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  )
}
