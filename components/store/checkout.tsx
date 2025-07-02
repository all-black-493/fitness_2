"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Dynamic imports for server actions
const createPaymentIntentAction = async (amount: number) =>
    (await import("@/lib/actions/store")).createPaymentIntent(amount)
const getCartForCheckoutAction = async () =>
    (await import("@/lib/actions/store")).getCartForCheckout()

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

function CheckoutForm({ items, total }: { items: any[]; total: number }) {
    const stripe = useStripe()
    const elements = useElements()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        async function fetchIntent() {
            setLoading(true)
            setError(null)
            try {
                const data = await createPaymentIntentAction(total)
                setClientSecret(data.clientSecret)
            } catch (err: any) {
                setError(err.message || "Failed to create payment intent")
            } finally {
                setLoading(false)
            }
        }
        if (total > 0) fetchIntent()
    }, [total])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!stripe || !elements || !clientSecret) return
        setLoading(true)
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        })
        if (result.error) setError(result.error.message || "Payment failed")
        else if (result.paymentIntent?.status === "succeeded") {
            setSuccess(true)
            // Optionally: clear cart via API
        } else setError("Payment failed")
        setLoading(false)
    }

    if (success)
        return <div className="text-green-600 font-semibold text-center py-8">Payment successful! Thank you for your purchase.</div>

    return (
        <form action={createPaymentIntentAction} className="space-y-4">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} className="p-3 border rounded bg-background" />
            {error && <div role="alert" className="text-destructive" aria-live="polite">{error}</div>}
            <Button type="submit" className="w-full" disabled={!stripe || !elements || !clientSecret || loading} aria-label="Pay with Stripe">
                {loading ? "Processing..." : `Pay Ksh ${total}`}
            </Button>
        </form>
    )
}

export function Checkout() {
    const [items, setItems] = useState<any[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function fetchCart() {
            setLoading(true)
            setError(null)
            try {
                const data = await getCartForCheckoutAction()
                setItems(data)
                setTotal(data.reduce((sum: number, item: any) => sum + (item.price_ksh || 0), 0))
            } catch (err: any) {
                setError(err.message || "Failed to load cart")
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [])

    if (loading) return <LoadingSkeleton className="h-40 w-full" />
    if (error) return <div role="alert" className="text-destructive">{error}</div>
    if (!items || items.length === 0) return <div className="text-muted-foreground">Your cart is empty.</div>

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="divide-y">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center py-4 gap-4">
                            <img
                                src={item.products?.image || "/placeholder.svg"}
                                alt={item.products?.name || "Product"}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{item.products?.name || item.item_type}</div>
                                <div className="text-sm text-muted-foreground">Ksh {item.price_ksh}</div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold">Ksh {total}</span>
                </div>
                <Elements stripe={stripePromise}>
                    <CheckoutForm items={items} total={total} />
                </Elements>
                <div className="pt-2 text-center">
                    <Link href="/store/cart" className="text-sm underline text-muted-foreground">Back to Cart</Link>
                </div>
            </CardContent>
        </Card>
    )
} 