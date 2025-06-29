"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

type CartItem = Database["public"]["Tables"]["cart_items"]["Row"]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    }
  }, [user])

  const fetchCartItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("cart_items").select("*").eq("profile_id", user.id)

      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (itemType: "workout_plan" | "session", itemId: string, priceKsh: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            profile_id: user.id,
            item_type: itemType,
            item_id: itemId,
            price_ksh: priceKsh,
          },
        ])
        .select()
        .single()

      if (error) throw error
      setCartItems((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

      if (error) throw error
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart_items").delete().eq("profile_id", user.id)

      if (error) throw error
      setCartItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price_ksh, 0)

  return {
    cartItems,
    loading,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems,
  }
}
