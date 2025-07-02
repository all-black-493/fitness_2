"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { StreamChat } from "stream-chat"

const streamClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
)

export async function createStreamToken(userId: string, username: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        // Create or update user in Stream
        await streamClient.upsertUser({
            id: userId,
            name: username,
            role: "user"
        })

        // Generate user token
        const token = streamClient.createToken(userId)

        return {
            token,
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY
        }
    } catch (error) {
        console.error("Error creating stream token:", error)
        throw new Error("Failed to create stream token")
    }
}

export async function createLiveStreamSession(title: string, description?: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        // Get user profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, display_name")
            .eq("id", user.id)
            .single()

        if (!profile) {
            throw new Error("User profile not found")
        }

        // Create a unique channel ID for the live stream
        const channelId = `livestream-${user.id}-${Date.now()}`

        // Create Stream channel
        const channel = streamClient.channel("livestream", channelId, {
            name: title,
            description: description || `Live workout session by ${profile.display_name || profile.username}`,
            created_by_id: user.id,
            members: [user.id],
            custom: {
                type: "workout",
                status: "live"
            }
        })

        await channel.create()

        return {
            channelId,
            channel: channel
        }
    } catch (error) {
        console.error("Error creating live stream session:", error)
        throw new Error("Failed to create live stream session")
    }
}

export async function getActiveLiveStreams() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        // Query Stream for active live streams
        const filter = {
            type: "livestream",
            "custom.status": "live"
        }

        const sort = [{ last_message_at: -1 }]

        const channels = await streamClient.queryChannels(filter, sort, {
            limit: 10
        })

        // Get user profiles for the stream creators
        const userIds = channels.map(channel => channel.created_by_id).filter(Boolean)

        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, display_name, avatar_url")
            .in("id", userIds)

        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

        return channels.map(channel => ({
            id: channel.id,
            title: channel.data?.name || "Untitled Stream",
            description: channel.data?.description || "",
            creator: profilesMap.get(channel.created_by_id || "") || {
                username: "Unknown",
                display_name: "Unknown User"
            },
            memberCount: channel.member_count || 0,
            createdAt: channel.created_at
        }))
    } catch (error) {
        console.error("Error fetching active live streams:", error)
        throw new Error("Failed to fetch active live streams")
    }
}

export async function joinLiveStream(channelId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        const channel = streamClient.channel("livestream", channelId)
        await channel.addMembers([user.id])

        return {
            success: true,
            channelId
        }
    } catch (error) {
        console.error("Error joining live stream:", error)
        throw new Error("Failed to join live stream")
    }
}

export async function leaveLiveStream(channelId: string) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error("Authentication required")
    }

    try {
        const channel = streamClient.channel("livestream", channelId)
        await channel.removeMembers([user.id])

        return {
            success: true,
            channelId
        }
    } catch (error) {
        console.error("Error leaving live stream:", error)
        throw new Error("Failed to leave live stream")
    }
} 