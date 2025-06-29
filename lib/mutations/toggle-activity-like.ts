import { createClient } from "@/lib/supabase/client"

export const handleLikeToggle = async (activityId: string, userId: string) => {
  const supabase = createClient()
  if (!userId) return

  const { data: existing, error } = await supabase
    .from("activity_likes")
    .select("*")
    .eq("activity_id", activityId)
    .eq("profile_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Like check failed", error)
    return
  }

  if (existing) {
    await supabase
      .from("activity_likes")
      .delete()
      .eq("id", existing.id)
  } else {
    await supabase
      .from("activity_likes")
      .insert({
        activity_id: activityId,
        profile_id: userId,
      })
  }
}
