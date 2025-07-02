"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import type { Database } from "@/database.types"

// Dynamic imports for server actions
const getCommunityPostsAction = async (communityId: string) =>
  (await import("@/lib/actions/communities")).getCommunityPosts(communityId)
const createCommunityPostAction = async (communityId: string, content: string, type = "discussion") =>
  (await import("@/lib/actions/communities")).createCommunityPost(communityId, content, type)
const updateCommunityPostAction = async (communityId: string, postId: string, updates: any) =>
  (await import("@/lib/actions/communities")).updateCommunityPost(communityId, postId, updates)
const deleteCommunityPostAction = async (communityId: string, postId: string) =>
  (await import("@/lib/actions/communities")).deleteCommunityPost(communityId, postId)

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: Database["public"]["Tables"]["profiles"]["Row"]
  comments: Database["public"]["Tables"]["comments"]["Row"][]
}

export function useCommunityPosts(communityId: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchPosts = async () => {
    if (!communityId || !user) {
      setPosts([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getCommunityPostsAction(communityId)
      setPosts(data || [])
    } catch (err: any) {
      console.error("Error fetching posts:", err)
      setError(err.message || "Failed to fetch posts")
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string, type = "discussion") => {
    try {
      const post = await createCommunityPostAction(communityId, content, type)
      setPosts((prev) => [post, ...prev])
      setError(null)
      return post
    } catch (err: any) {
      setError(err.message || "Failed to create post")
      throw err
    }
  }

  const editPost = async (postId: string, updates: { content?: string; image_url?: string }) => {
    try {
      const updated = await updateCommunityPostAction(communityId, postId, updates)
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)))
      setError(null)
      return updated
    } catch (err: any) {
      setError(err.message || "Failed to update post")
      throw err
    }
  }

  const deletePost = async (postId: string) => {
    try {
      await deleteCommunityPostAction(communityId, postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
      setError(null)
      return true
    } catch (err: any) {
      setError(err.message || "Failed to delete post")
      throw err
    }
  }

  const likePost = async (postId: string) => {
    // ... existing code ...
  }

  const addComment = async (postId: string, content: string) => {
    // ... existing code ...
  }

  useEffect(() => {
    if (!user) {
      return
    }

    if (communityId) {
      fetchPosts()
    }
  }, [communityId, user])

  return {
    posts,
    loading,
    error,
    createPost,
    editPost,
    deletePost,
    likePost,
    addComment,
    refreshPosts: fetchPosts,
  }
}
