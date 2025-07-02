"use server"

import { createClient } from "@/lib/supabase-utils/server"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function getProductsByType(type: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by type:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

export async function getProduct(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product")
  }

  return data
}

export async function createPaymentIntent(amount: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/store/payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to create payment intent")
    }

    return { clientSecret: data.clientSecret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

export async function getCartForCheckout() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products:product_id (
        id,
        name,
        image
      )
    `)
    .eq("profile_id", user.id)

  if (error) {
    console.error("Error fetching cart for checkout:", error)
    throw new Error("Failed to fetch cart")
  }

  return data || []
} 