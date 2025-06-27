import type { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/utils/api-response"
import { middleware } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await middleware(request)

    const mockCart = {
      items: [
        {
          id: "cart_item_1",
          productId: "product_1",
          name: "Optimum Nutrition Gold Standard Whey",
          price: 59.99,
          quantity: 1,
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
      total: 59.99,
      itemCount: 1,
    }

    return successResponse(mockCart)
  } catch (error) {
    return errorResponse("Failed to fetch cart", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await middleware(request)
    const { productId, quantity } = await request.json()

    return successResponse(null, "Item added to cart successfully")
  } catch (error) {
    return errorResponse("Failed to add item to cart", 500)
  }
}
