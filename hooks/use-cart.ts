"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/database.types"
import { useAuth } from "./use-auth"

// Dynamic imports for server actions
const getCartItemsAction = async () =>
  (await import("@/lib/actions/cart")).getCartItems()
const addToCartAction = async (itemType: "workout_plan" | "session", itemId: string, priceKsh: number) =>
  (await import("@/lib/actions/cart")).addToCart(itemType, itemId, priceKsh)
const removeFromCartAction = async (cartItemId: string) =>
  (await import("@/lib/actions/cart")).removeFromCart(cartItemId)
const clearCartAction = async () =>
  (await import("@/lib/actions/cart")).clearCart()

type CartItem = Database["public"]["Tables"]["cart_items"]["Row"]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getCartItemsAction()
      setCartItems(data || [])
    } catch (err: any) {
      console.error("Error fetching cart items:", err)
      setError(err.message || "Failed to fetch cart items")
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (itemType: "workout_plan" | "session", itemId: string, priceKsh: number) => {
    if (!user) return

    try {
      const result = await addToCartAction(itemType, itemId, priceKsh)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.data) {
        setCartItems((prev) => [...prev, result.data])
      }
      setError(null)
      return result.data
    } catch (err: any) {
      console.error("Error adding to cart:", err)
      setError(err.message || "Failed to add to cart")
      throw err
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      await removeFromCartAction(cartItemId)
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
      setError(null)
    } catch (err: any) {
      console.error("Error removing from cart:", err)
      setError(err.message || "Failed to remove from cart")
      throw err
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      await clearCartAction()
      setCartItems([])
      setError(null)
    } catch (err: any) {
      console.error("Error clearing cart:", err)
      setError(err.message || "Failed to clear cart")
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchCartItems()
    }
  }, [user])

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price_ksh, 0)

  return {
    cartItems,
    loading,
    error,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems,
  }
}

