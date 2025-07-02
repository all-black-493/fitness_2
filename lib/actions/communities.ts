"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { createCommunitySchema, createPostSchema, sendMessageSchema } from "@/lib/validations/community"
import { encryptMessage, encryptCommunityMessage } from "@/lib/crypto/encryptMessage"
import { getPrivateKey } from "@/lib/crypto/generateKeyPair"
import { revalidatePath } from "next/cache"

export async function createCommunity(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const validatedFields = createCommunitySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    isPrivate: formData.get("isPrivate") === "true",
    avatarUrl: formData.get("avatarUrl"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid community data",
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, isPrivate, avatarUrl } = validatedFields.data

  const { data, error } = await supabase
    .from("communities")
    .insert([
      {
        name,
        description,
        is_private: isPrivate,
        avatar_url: avatarUrl,
        created_by: user.id,
        member_count: 1,
      },
    ])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Add creator as admin member
  await supabase.from("community_members").insert([
    {
      community_id: data.id,
      user_id: user.id,
      role: "admin",
    },
  ])

  revalidatePath("/communities")
  return { success: true, data }
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const validatedFields = createPostSchema.safeParse({
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl"),
    communityId: formData.get("communityId"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid post data",
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { content, imageUrl, communityId } = validatedFields.data

  // Check if user is a member of the community
  const { data: membership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    return { error: "You must be a member to post in this community" }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        community_id: communityId,
        user_id: user.id,
        content,
        image_url: imageUrl,
      },
    ])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Update community post count
  await supabase.rpc("increment_post_count", { community_id: communityId })

  revalidatePath(`/communities/${communityId}`)
  return { success: true, data }
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const validatedFields = sendMessageSchema.safeParse({
    content: formData.get("content"),
    recipientId: formData.get("recipientId"),
    communityId: formData.get("communityId"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid message data",
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { content, recipientId, communityId } = validatedFields.data

  // Get sender's private key (in production, this would be stored securely)
  const senderPrivateKey = getPrivateKey(user.id)
  if (!senderPrivateKey) {
    return { error: "Encryption keys not found" }
  }

  let encryptedContent: string
  let messageType: "direct" | "community"

  if (recipientId) {
    // Direct message - encrypt for recipient
    const { data: recipient } = await supabase.from("users").select("public_key").eq("id", recipientId).single()

    if (!recipient?.public_key) {
      return { error: "Recipient encryption key not found" }
    }

    encryptedContent = encryptMessage(content, recipient.public_key, senderPrivateKey)
    messageType = "direct"
  } else if (communityId) {
    // Community message - encrypt for community
    encryptedContent = encryptCommunityMessage(content, communityId, senderPrivateKey)
    messageType = "community"
  } else {
    return { error: "Either recipient or community must be specified" }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: user.id,
        recipient_id: recipientId,
        community_id: communityId,
        encrypted_content: encryptedContent,
        message_type: messageType,
      },
    ])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function joinCommunity(communityId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if already a member
  const { data: existingMembership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single()

  if (existingMembership) {
    return { error: "Already a member of this community" }
  }

  const { error } = await supabase.from("community_members").insert([
    {
      community_id: communityId,
      user_id: user.id,
      role: "member",
    },
  ])

  if (error) {
    return { error: error.message }
  }

  // Update community member count
  await supabase.rpc("increment_member_count", { community_id: communityId })

  revalidatePath("/communities")
  return { success: true }
}

export async function getCommunities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching communities:", error)
    return []
  }
  return data || []
}

export async function getUserCommunities() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error("Authentication required or failed:", authError)
    return []
  }
  const { data, error } = await supabase
    .from("community_members")
    .select("community:community_id(*)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
  if (error) {
    console.error("Error fetching user communities:", error)
    return []
  }
  // Flatten the result to just the community objects
  return (data || []).map((row: any) => row.community)
}

export async function getCommunityWorkouts(communityId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community
  const { data: membership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("profile_id", user.id)
    .single()

  if (!membership) {
    throw new Error("Not a member of this community")
  }

  const { data, error } = await supabase
    .from("community_workouts")
    .select(`
      *,
      created_by:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching community workouts:", error)
    throw new Error("Failed to fetch community workouts")
  }

  return data || []
}

export async function createCommunityWorkout(communityId: string, workout: any) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community
  const { data: membership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    throw new Error("Not a member of this community")
  }

  const { data, error } = await supabase
    .from("community_workouts")
    .insert({
      ...workout,
      community_id: communityId,
      created_by: user.id,
    })
    .select(`
      *,
      created_by:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error("Error creating community workout:", error)
    throw new Error("Failed to create community workout")
  }

  revalidatePath(`/communities/${communityId}`)
  return data
}

export async function updateCommunityWorkout(communityId: string, workoutId: string, updates: any) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community and owns the workout
  const { data: workout } = await supabase
    .from("community_workouts")
    .select("created_by")
    .eq("id", workoutId)
    .eq("community_id", communityId)
    .single()

  if (!workout) {
    throw new Error("Workout not found")
  }

  if (workout.created_by !== user.id) {
    throw new Error("Not authorized to update this workout")
  }

  const { data, error } = await supabase
    .from("community_workouts")
    .update(updates)
    .eq("id", workoutId)
    .eq("community_id", communityId)
    .select(`
      *,
      created_by:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error("Error updating community workout:", error)
    throw new Error("Failed to update community workout")
  }

  revalidatePath(`/communities/${communityId}`)
  return data
}

export async function deleteCommunityWorkout(communityId: string, workoutId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community and owns the workout
  const { data: workout } = await supabase
    .from("community_workouts")
    .select("created_by")
    .eq("id", workoutId)
    .eq("community_id", communityId)
    .single()

  if (!workout) {
    throw new Error("Workout not found")
  }

  if (workout.created_by !== user.id) {
    throw new Error("Not authorized to delete this workout")
  }

  const { error } = await supabase
    .from("community_workouts")
    .delete()
    .eq("id", workoutId)
    .eq("community_id", communityId)

  if (error) {
    console.error("Error deleting community workout:", error)
    throw new Error("Failed to delete community workout")
  }

  revalidatePath(`/communities/${communityId}`)
  return { success: true }
}

export async function getCommunityPosts(communityId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community
  const { data: membership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    throw new Error("Not a member of this community")
  }

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles (
        id,
        username,
        display_name,
        avatar_url
      ),
      comments:comments (
        *,
        author:profiles (
          id,
          username,
          display_name,
          avatar_url
        )
      )
    `)
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching community posts:", error)
    throw new Error("Failed to fetch community posts")
  }

  return data || []
}

export async function createCommunityPost(communityId: string, content: string, type = "discussion") {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community
  const { data: membership } = await supabase
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    throw new Error("Not a member of this community")
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      content,
      type,
      community_id: communityId,
      author_id: user.id,
    })
    .select(`
      *,
      author:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error("Error creating community post:", error)
    throw new Error("Failed to create community post")
  }

  revalidatePath(`/communities/${communityId}`)
  return data
}

export async function updateCommunityPost(communityId: string, postId: string, updates: { content?: string; image_url?: string }) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community and owns the post
  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .eq("community_id", communityId)
    .single()

  if (!post) {
    throw new Error("Post not found")
  }

  if (post.author_id !== user.id) {
    throw new Error("Not authorized to update this post")
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .eq("community_id", communityId)
    .select(`
      *,
      author:profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error("Error updating community post:", error)
    throw new Error("Failed to update community post")
  }

  revalidatePath(`/communities/${communityId}`)
  return data
}

export async function deleteCommunityPost(communityId: string, postId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Check if user is a member of the community and owns the post
  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .eq("community_id", communityId)
    .single()

  if (!post) {
    throw new Error("Post not found")
  }

  if (post.author_id !== user.id) {
    throw new Error("Not authorized to delete this post")
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("community_id", communityId)

  if (error) {
    console.error("Error deleting community post:", error)
    throw new Error("Failed to delete community post")
  }

  revalidatePath(`/communities/${communityId}`)
  return { success: true }
}
