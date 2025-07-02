"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"

// Dynamic imports for server actions
const getChallengesAction = async () => (await import("@/lib/actions/challenges")).getChallenges()
const getUserChallengesAction = async () => (await import("@/lib/actions/challenges")).getUserChallenges()
const joinChallengeAction = async (challengeId: string) => (await import("@/lib/actions/challenges")).joinChallenge(challengeId)
const leaveChallengeAction = async (challengeId: string) => (await import("@/lib/actions/challenges")).leaveChallenge(challengeId)
const updateChallengeProgressAction = async (challengeId: string, progress: number) => (await import("@/lib/actions/challenges")).updateChallengeProgress(challengeId, progress)
const createChallengeAction = async (challenge: any) => (await import("@/lib/actions/challenges")).createChallenge(challenge)
const updateChallengeAction = async (challengeId: string, updates: any) => (await import("@/lib/actions/challenges")).updateChallenge(challengeId, updates)
const deleteChallengeAction = async (challengeId: string) => (await import("@/lib/actions/challenges")).deleteChallenge(challengeId)
const getChallengeAction = async (challengeId: string) => (await import("@/lib/actions/challenges")).getChallenge(challengeId)
const getChallengeParticipantsAction = async (challengeId: string) => (await import("@/lib/actions/challenges")).getChallengeParticipants(challengeId)

export function useChallenges() {
  const [challenges, setChallenges] = useState<Database["public"]["Tables"]["challenges"]["Row"][]>([])
  const [userChallenges, setUserChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenges = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getChallengesAction()
      setChallenges(data)
    } catch (e: any) {
      setError(e.message || "Failed to fetch challenges")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserChallenges = async () => {
    setError(null)
    try {
      const data = await getUserChallengesAction()
      setUserChallenges(data)
    } catch (e: any) {
      setError(e.message || "Failed to fetch user challenges")
    }
  }

  async function joinChallenge(challengeId: string) {
    setError(null)
    try {
      return await joinChallengeAction(challengeId)
    } catch (e: any) {
      setError(e.message || "Failed to join challenge")
      return { error: e.message || "Failed to join challenge" }
    }
  }

  async function leaveChallenge(challengeId: string) {
    setError(null)
    try {
      return await leaveChallengeAction(challengeId)
    } catch (e: any) {
      setError(e.message || "Failed to leave challenge")
      return { error: e.message || "Failed to leave challenge" }
    }
  }

  async function updateChallengeProgress(challengeId: string, progress: number) {
    setError(null)
    try {
      return await updateChallengeProgressAction(challengeId, progress)
    } catch (e: any) {
      setError(e.message || "Failed to update progress")
      return { error: e.message || "Failed to update progress" }
    }
  }

  async function createChallenge(challenge: any) {
    setError(null)
    try {
      return await createChallengeAction(challenge)
    } catch (e: any) {
      setError(e.message || "Failed to create challenge")
      return { error: e.message || "Failed to create challenge" }
    }
  }

  async function updateChallenge(challengeId: string, updates: any) {
    setError(null)
    try {
      return await updateChallengeAction(challengeId, updates)
    } catch (e: any) {
      setError(e.message || "Failed to update challenge")
      return { error: e.message || "Failed to update challenge" }
    }
  }

  async function deleteChallenge(challengeId: string) {
    setError(null)
    try {
      return await deleteChallengeAction(challengeId)
    } catch (e: any) {
      setError(e.message || "Failed to delete challenge")
      return { error: e.message || "Failed to delete challenge" }
    }
  }

  async function getChallenge(challengeId: string) {
    setError(null)
    try {
      return await getChallengeAction(challengeId)
    } catch (e: any) {
      setError(e.message || "Failed to get challenge")
      return { error: e.message || "Failed to get challenge" }
    }
  }

  async function getChallengeParticipants(challengeId: string) {
    setError(null)
    try {
      return await getChallengeParticipantsAction(challengeId)
    } catch (e: any) {
      setError(e.message || "Failed to get participants")
      return { error: e.message || "Failed to get participants" }
    }
  }

  useEffect(() => {
    fetchChallenges()
    fetchUserChallenges()
  }, [])

  return {
    challenges,
    userChallenges,
    loading,
    error,
    joinChallenge,
    leaveChallenge,
    updateChallengeProgress,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getChallenge,
    getChallengeParticipants,
    refreshChallenges: fetchChallenges,
    refreshUserChallenges: fetchUserChallenges,
  }
}

