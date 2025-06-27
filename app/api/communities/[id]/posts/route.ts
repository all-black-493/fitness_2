import type { NextRequest } from "next/server"
import { getAuthUser, createResponse, createErrorResponse } from "@/lib/utils/api-helpers"

const mockPosts = [
  {
    id: 1,
    author: "Mike Strong",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2 hours ago",
    content:
      "Just hit a new PR on deadlift! 405lbs 💪 Been working on my form for months and it finally paid off. Thanks to everyone in this community for the tips and motivation!",
    likes: 23,
    comments: 8,
    hasLiked: false,
    images: ["/placeholder.svg?height=300&width=400"],
    type: "achievement",
  },
  {
    id: 2,
    author: "Sarah Lifter",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "5 hours ago",
    content:
      "Question for the experienced lifters: What's your favorite accessory exercise for improving bench press? I'm stuck at 185lbs and looking for ways to break through this plateau.",
    likes: 15,
    comments: 12,
    hasLiked: true,
    type: "question",
  },
]

//TODO: Replace with actual database or service calls
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  return createResponse({
    posts: mockPosts,
    total: mockPosts.length,
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(request)
  if (!user) {
    return createErrorResponse("Unauthorized", 401)
  }

  try {
    const body = await request.json()
    const { content, type = "discussion" } = body

    if (!content?.trim()) {
      return createErrorResponse("Content is required")
    }

    const newPost = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      time: "Just now",
      content,
      likes: 0,
      comments: 0,
      hasLiked: false,
      type,
    }

    mockPosts.unshift(newPost)

    return createResponse(newPost, "Post created successfully!")
  } catch (error) {
    return createErrorResponse("Invalid request body")
  }
}
