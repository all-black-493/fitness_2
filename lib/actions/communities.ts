"use server"

import { createClient } from "@/lib/supabase/server"
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
