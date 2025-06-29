"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createNotification(userId: string, title: string, message: string, type: string, data?: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      title,
      message,
      type,
      data,
    },
  ])

  if (error) {
    console.error("Error creating notification:", error)
    return { error: error.message }
  }

  return { success: true }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id) // Ensure user can only update their own notifications

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/notifications")
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/notifications")
  return { success: true }
}
