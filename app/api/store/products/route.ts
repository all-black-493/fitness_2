import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse, getQueryParams } from "@/lib/utils/api-helpers"

const mockProducts = [
  {
    id: "1",
    name: "Premium Whey Protein",
    brand: "FitNutrition",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 1247,
    category: "supplements",
    image: "/placeholder.svg?height=200&width=200",
    description: "High-quality whey protein isolate for muscle building and recovery.",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Performance T-Shirt",
    brand: "ActiveWear",
    price: 29.99,
    rating: 4.6,
    reviews: 523,
    category: "apparel",
    image: "/placeholder.svg?height=200&width=200",
    description: "Moisture-wicking performance shirt for intense workouts.",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Adjustable Dumbbells",
    brand: "HomeFit",
    price: 299.99,
    rating: 4.9,
    reviews: 89,
    category: "equipment",
    image: "/placeholder.svg?height=200&width=200",
    description: "Space-saving adjustable dumbbells, 5-50 lbs per dumbbell.",
    inStock: true,
  },
]

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  const { category, limit, offset } = getQueryParams(request)

  let filteredProducts = mockProducts

  if (category) {
    filteredProducts = mockProducts.filter((p) => p.category === category)
  }

  const paginatedProducts = filteredProducts.slice(offset, offset + limit)

  return createResponse({
    products: paginatedProducts,
    total: filteredProducts.length,
    hasMore: offset + limit < filteredProducts.length,
  })
}
