"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./use-auth"
import type { Database } from "@/database.types"

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  author: Database["public"]["Tables"]["profiles"]["Row"]
  comments: Database["public"]["Tables"]["comments"]["Row"][]
}

export function useCommunityPosts(communityId: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (communityId) {
      fetchPosts()
    }
  }, [communityId])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(*),
          comments(*)
        `)
        .eq("community_id", communityId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string, type = "discussion") => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          community_id: communityId,
          profile_id: user.id,
          content,
          type,
        })
        .select(`
          *,
          author:profiles(*),
          comments(*)
        `)
        .single()

      if (error) throw error

      setPosts((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error("Error creating post:", error)
      throw error
    }
  }

  const likePost = async (postId: string) => {
    if (!user) return

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("profile_id", user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("profile_id", user.id)
      } else {
        // Like
        await supabase.from("post_likes").insert({
          post_id: postId,
          profile_id: user.id,
        })
      }

      // Refresh posts to update like counts
      await fetchPosts()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const addComment = async (postId: string, content: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        profile_id: user.id,
        content,
      })

      if (error) throw error

      // Refresh posts to include new comment
      await fetchPosts()
    } catch (error) {
      console.error("Error adding comment:", error)
      throw error
    }
  }

  return {
    posts,
    loading,
    createPost,
    likePost,
    addComment,
    refreshPosts: fetchPosts,
  }
}
