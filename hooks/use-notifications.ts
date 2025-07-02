"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

// Dynamic imports for server actions
const getNotificationsAction = async (limit = 50) =>
  (await import("@/lib/actions/notifications")).getNotifications(limit)
const markNotificationAsReadAction = async (notificationId: string) =>
  (await import("@/lib/actions/notifications")).markNotificationAsRead(notificationId)
const markAllNotificationsAsReadAction = async () =>
  (await import("@/lib/actions/notifications")).markAllNotificationsAsRead()

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getNotificationsAction(50)
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.is_read).length)
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications")
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsReadAction(notificationId)

      // Optimistically update the UI
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err: any) {
      setError(err.message || "Failed to mark notification as read")
      throw err
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await markAllNotificationsAsReadAction()

      // Optimistically update the UI
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err: any) {
      setError(err.message || "Failed to mark all notifications as read")
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Set up realtime subscription for notifications
      let supabase: any
      let subscription: any

      import("@/lib/supabase-utils/client").then(({ createClient }) => {
        supabase = createClient()
        subscription = supabase
          .channel("notifications")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `profile_id=eq.${user.id}`,
            },
            (payload) => {
              setNotifications((prev) => [payload.new as Notification, ...prev])
              setUnreadCount((prev) => prev + 1)
            },
          )
          .subscribe()
      })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    }
  }, [user])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  }
}
