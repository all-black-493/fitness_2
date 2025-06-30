import { createClient } from "@/lib/supabase/client"

export async function sendFriendRequest(fromId: string, toId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from("friends")
    .insert([
      {
        profile_id: fromId,
        friend_id: toId,
        status: "pending",
      },
    ])

  if (error) {
    console.error("Failed to send friend request", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
