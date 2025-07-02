"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/database.types"

type Friend = Database["public"]["Tables"]["friends"]["Row"]
type FriendInsert = Database["public"]["Tables"]["friends"]["Insert"]

export async function sendFriendRequest(friendId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    if (user.id === friendId) {
        throw new Error("Cannot send friend request to yourself")
    }

    // Check if friend request already exists
    const { data: existingRequest } = await supabase
        .from("friends")
        .select("*")
        .or(`and(profile_id.eq.${user.id},friend_id.eq.${friendId}),and(profile_id.eq.${friendId},friend_id.eq.${user.id})`)
        .single()

    if (existingRequest) {
        throw new Error("Friend request already exists")
    }

    const { data, error } = await supabase
        .from("friends")
        .insert({
            profile_id: user.id,
            friend_id: friendId,
            status: "pending",
        })
        .select()
        .single()

    if (error) {
        console.error("Error sending friend request:", error)
        throw new Error("Failed to send friend request")
    }

    // Create notification for the friend
    await supabase.from("notifications").insert({
        profile_id: friendId,
        title: "New Friend Request",
        message: "You have a new friend request",
        type: "friend_request",
        data: { from_user_id: user.id }
    })

    revalidatePath("/friends")
    revalidatePath("/profile")
    return data
}

export async function acceptFriendRequest(requestId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    // Update the friend request status
    const { data, error } = await supabase
        .from("friends")
        .update({ status: "accepted" })
        .eq("id", requestId)
        .eq("friend_id", user.id)
        .select()
        .single()

    if (error) {
        console.error("Error accepting friend request:", error)
        throw new Error("Failed to accept friend request")
    }

    // Create notification for the sender
    await supabase.from("notifications").insert({
        profile_id: data.profile_id,
        title: "Friend Request Accepted",
        message: "Your friend request was accepted",
        type: "friend_accepted",
        data: { accepted_by_user_id: user.id }
    })

    revalidatePath("/friends")
    revalidatePath("/profile")
    return data
}

export async function rejectFriendRequest(requestId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { error } = await supabase
        .from("friends")
        .delete()
        .eq("id", requestId)
        .eq("friend_id", user.id)

    if (error) {
        console.error("Error rejecting friend request:", error)
        throw new Error("Failed to reject friend request")
    }

    revalidatePath("/friends")
    revalidatePath("/profile")
    return { success: true }
}

export async function removeFriend(friendId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { error } = await supabase
        .from("friends")
        .delete()
        .or(`and(profile_id.eq.${user.id},friend_id.eq.${friendId}),and(profile_id.eq.${friendId},friend_id.eq.${user.id})`)

    if (error) {
        console.error("Error removing friend:", error)
        throw new Error("Failed to remove friend")
    }

    revalidatePath("/friends")
    revalidatePath("/profile")
    return { success: true }
}

export async function getFriends() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("friends")
        .select(`
      *,
      friend:friend_id (
        id,
        username,
        display_name,
        avatar_url,
        bio,
        total_workouts,
        current_streak
      ),
      profile:profile_id (
        id,
        username,
        display_name,
        avatar_url,
        bio,
        total_workouts,
        current_streak
      )
    `)
        .or(`profile_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq("status", "accepted")

    if (error) {
        console.error("Error fetching friends:", error)
        throw new Error("Failed to fetch friends")
    }

    // Transform the data to return friend objects
    const friends = data?.map(friend => {
        if (friend.profile_id === user.id) {
            return {
                ...friend,
                friend: friend.friend
            }
        } else {
            return {
                ...friend,
                friend: friend.profile
            }
        }
    }) || []

    return friends
}

export async function getPendingFriendRequests() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("friends")
        .select(`
      *,
      profile:profile_id (
        id,
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
        .eq("friend_id", user.id)
        .eq("status", "pending")

    if (error) {
        console.error("Error fetching pending friend requests:", error)
        throw new Error("Failed to fetch pending friend requests")
    }

    return data || []
}

export async function searchUsers(query: string, limit = 10) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .neq("id", user.id)
        .limit(limit)

    if (error) {
        console.error("Error searching users:", error)
        throw new Error("Failed to search users")
    }

    return data || []
}

export async function getFriendSuggestions(search: string = "", limit = 10) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    // Get all friend relationships (accepted and pending)
    const { data: friendsData, error: friendsError } = await supabase
        .from("friends")
        .select("profile_id, friend_id")
        .or(`profile_id.eq.${user.id},friend_id.eq.${user.id}`)
        .in("status", ["accepted", "pending"])

    if (friendsError) {
        console.error("Error fetching friend relationships:", friendsError)
        throw new Error("Failed to fetch friend relationships")
    }

    // Build exclusion list
    const excludedIds = new Set<string>()
    excludedIds.add(user.id) // Exclude self

    friendsData?.forEach((relation) => {
        excludedIds.add(relation.profile_id)
        excludedIds.add(relation.friend_id)
    })

    // Build query for profiles
    let query = supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")

    // Exclude existing friends and self
    if (excludedIds.size > 0) {
        query = query.not("id", "in", `(${Array.from(excludedIds).join(",")})`)
    }

    // Add search filter if provided
    if (search) {
        query = query.ilike("username", `%${search}%`)
    }

    // Execute query with limit
    const { data: profiles, error: profilesError } = await query.limit(limit)

    if (profilesError) {
        console.error("Error fetching suggested profiles:", profilesError)
        throw new Error("Failed to fetch suggested profiles")
    }

    return profiles || []
} 