"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { revalidatePath } from "next/cache"

export async function addToCart(itemType: "workout_plan" | "session", itemId: string, priceKsh: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if item already in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .single()

  if (existingItem) {
    return { error: "Item already in cart" }
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert([
      {
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        price_ksh: priceKsh,
      },
    ])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/store")
  return { success: true, data }
}

export async function getCartItems() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("profile_id", user.id)

  if (error) {
    console.error("Error fetching cart items:", error)
    throw new Error("Failed to fetch cart items")
  }

  return data || []
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Ensure user owns the cart item
  const { data: cartItem } = await supabase
    .from("cart_items")
    .select("id")
    .eq("id", cartItemId)
    .eq("profile_id", user.id)
    .single()

  if (!cartItem) {
    throw new Error("Cart item not found or not authorized")
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("profile_id", user.id)

  if (error) {
    console.error("Error removing from cart:", error)
    throw new Error("Failed to remove item from cart")
  }

  revalidatePath("/store")
  return { success: true }
}

export async function clearCart() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("profile_id", user.id)

  if (error) {
    console.error("Error clearing cart:", error)
    throw new Error("Failed to clear cart")
  }

  revalidatePath("/store")
  return { success: true }
}
