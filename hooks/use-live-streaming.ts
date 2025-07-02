"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { StreamVideoClient } from "@stream-io/video-react-sdk"

// Dynamic imports for server actions
const createStreamTokenAction = async (userId: string, email: string) =>
    (await import("@/lib/actions/streaming")).createStreamToken(userId, email)
const createLiveStreamSessionAction = async (title: string, description?: string) =>
    (await import("@/lib/actions/streaming")).createLiveStreamSession(title, description)
const getActiveLiveStreamsAction = async () =>
    (await import("@/lib/actions/streaming")).getActiveLiveStreams()
const joinLiveStreamAction = async (channelId: string) =>
    (await import("@/lib/actions/streaming")).joinLiveStream(channelId)
const leaveLiveStreamAction = async (channelId: string) =>
    (await import("@/lib/actions/streaming")).leaveLiveStream(channelId)

interface LiveStream {
    id: string
    title: string
    description: string
    creator: {
        username: string
        display_name: string
        avatar_url?: string
    }
    memberCount: number
    createdAt: string
}

export function useLiveStreaming() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeStreams, setActiveStreams] = useState<LiveStream[]>([])
    const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
    const [currentStream, setCurrentStream] = useState<any>(null)
    const { user } = useAuth()

    const initializeVideoClient = async () => {
        if (!user) return null

        try {
            const { token, apiKey } = await createStreamTokenAction(user.id, user.email || "user")

            const client = new StreamVideoClient({
                apiKey,
                user: {
                    id: user.id,
                    name: user.email || "User"
                },
                token
            })

            setVideoClient(client)
            return client
        } catch (error: any) {
            setError(error.message || "Failed to initialize video client")
            throw error
        }
    }

    const startLiveStream = async (title: string, description?: string) => {
        if (!user) throw new Error("User not authenticated")

        setLoading(true)
        setError(null)

        try {
            // Initialize video client if not already done
            let client = videoClient
            if (!client) {
                client = await initializeVideoClient()
            }

            if (!client) {
                throw new Error("Failed to initialize video client")
            }

            // Create live stream session
            const { channelId } = await createLiveStreamSessionAction(title, description)

            // Create video call
            const call = client.call("livestream", channelId)
            await call.join()

            setCurrentStream({ call, channelId })
            return { call, channelId }
        } catch (error: any) {
            setError(error.message || "Failed to start live stream")
            throw error
        } finally {
            setLoading(false)
        }
    }

    const endLiveStream = async () => {
        setLoading(true)
        try {
            if (currentStream?.call) {
                await currentStream.call.leave()
            }
            if (videoClient) {
                await videoClient.disconnectUser()
            }
            setCurrentStream(null)
            setVideoClient(null)
        } catch (error: any) {
            setError(error.message || "Failed to end live stream")
        } finally {
            setLoading(false)
        }
    }

    const fetchActiveStreams = async () => {
        if (!user) return

        try {
            const streams = await getActiveLiveStreamsAction()
            setActiveStreams(streams)
        } catch (error: any) {
            setError(error.message || "Failed to fetch active streams")
        }
    }

    const joinStream = async (channelId: string) => {
        if (!user) throw new Error("User not authenticated")

        try {
            await joinLiveStreamAction(channelId)
            await fetchActiveStreams() // Refresh the list
        } catch (error: any) {
            setError(error.message || "Failed to join stream")
            throw error
        }
    }

    const leaveStream = async (channelId: string) => {
        if (!user) throw new Error("User not authenticated")

        try {
            await leaveLiveStreamAction(channelId)
            await fetchActiveStreams() // Refresh the list
        } catch (error: any) {
            setError(error.message || "Failed to leave stream")
            throw error
        }
    }

    // Fetch active streams on mount and periodically
    useEffect(() => {
        if (user) {
            fetchActiveStreams()

            // Refresh every 30 seconds
            const interval = setInterval(fetchActiveStreams, 30000)
            return () => clearInterval(interval)
        }
    }, [user])

    return {
        loading,
        error,
        activeStreams,
        videoClient,
        currentStream,
        startLiveStream,
        endLiveStream,
        joinStream,
        leaveStream,
        fetchActiveStreams,
        initializeVideoClient
    }
} 