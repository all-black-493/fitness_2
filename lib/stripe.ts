import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
})

export async function createPaymentIntent(amount: number, currency = "kes") {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return { success: false, error: "Failed to create payment intent" }
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return { success: false, error: "Failed to retrieve payment intent" }
  }
}
