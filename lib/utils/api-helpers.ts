import type { NextRequest } from "next/server"

export function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  // TODO: Decode JWT token
  return {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    username: "@johndoe",
    avatar: "/placeholder.svg?height=40&width=40",
  }
}

export function createResponse<T>(data: T, message?: string) {
  return Response.json({
    success: true,
    data,
    message,
  })
}

export function createErrorResponse(error: string, status = 400) {
  return Response.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return {
    limit: Number.parseInt(searchParams.get("limit") || "10"),
    offset: Number.parseInt(searchParams.get("offset") || "0"),
    tags: searchParams.get("tags")?.split(",") || [],
    category: searchParams.get("category"),
    search: searchParams.get("search"),
  }
}
