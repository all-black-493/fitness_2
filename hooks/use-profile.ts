"use client"

import { useEffect, useState } from 'react'
import type { Database } from '@/database.types'

// Dynamic imports for server actions
const getUserProfileAction = async (username: string) =>
    (await import("@/lib/actions/profile")).getUserProfile(username)
const getUserStatsAction = async (userId: string) =>
    (await import("@/lib/actions/profile")).getUserStats(userId)
const getUserAchievementsAction = async (userId: string) =>
    (await import("@/lib/actions/profile")).getUserAchievements(userId)
const getUserMilestonesAction = async (userId: string) =>
    (await import("@/lib/actions/profile")).getUserMilestones(userId)
const getUserChallengesAction = async (userId: string) =>
    (await import("@/lib/actions/profile")).getUserChallenges(userId)
const getUserCommunitiesAction = async (userId: string) =>
    (await import("@/lib/actions/profile")).getUserCommunities(userId)
const getUserRecentActivityAction = async (userId: string, limit = 10) =>
    (await import("@/lib/actions/profile")).getUserRecentActivity(userId, limit)

interface UseProfileResult {
    profile: Database['public']['Tables']['profiles']['Row'] | null
    stats: any | null
    achievements: any[]
    milestones: any[]
    challenges: any[]
    communities: any[]
    recentActivity: any[]
    loading: boolean
    error: string | null
}

export function useProfile({ username }: { username: string }): UseProfileResult {
    const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
    const [stats, setStats] = useState<any | null>(null)
    const [achievements, setAchievements] = useState<any[]>([])
    const [milestones, setMilestones] = useState<any[]>([])
    const [challenges, setChallenges] = useState<any[]>([])
    const [communities, setCommunities] = useState<any[]>([])
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!username) return
        setLoading(true)
        setError(null)

        async function fetchProfile() {
            try {
                // Fetch profile
                const profileData = await getUserProfileAction(username)
                setProfile(profileData)

                // Fetch all other data in parallel
                const [
                    statsData,
                    achievementsData,
                    milestonesData,
                    challengesData,
                    communitiesData,
                    recentActivityData
                ] = await Promise.all([
                    getUserStatsAction(profileData.id),
                    getUserAchievementsAction(profileData.id),
                    getUserMilestonesAction(profileData.id),
                    getUserChallengesAction(profileData.id),
                    getUserCommunitiesAction(profileData.id),
                    getUserRecentActivityAction(profileData.id, 10)
                ])

                setStats(statsData)
                setAchievements(achievementsData)
                setMilestones(milestonesData)
                setChallenges(challengesData)
                setCommunities(communitiesData)
                setRecentActivity(recentActivityData)
            } catch (err: any) {
                setError(err.message || 'Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [username])

    return {
        profile,
        stats,
        achievements,
        milestones,
        challenges,
        communities,
        recentActivity,
        loading,
        error,
    }
} 