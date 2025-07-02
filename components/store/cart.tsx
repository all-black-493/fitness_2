import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { removeFromCart, clearCart, getCartItems } from "@/lib/actions/cart"
import Link from "next/link"

export async function Cart() {
    try {
        const items = await getCartItems()

        if (!items || items.length === 0) {
            return <div className="text-muted-foreground">Your cart is empty.</div>
        }

        const total = items.reduce((sum, item) => sum + (item.price_ksh || 0), 0)

        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Your Cart</CardTitle>
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
                                <form action={async (formData) => { 'use server'; await removeFromCart(item.id) }}>
                                    <Button type="submit" size="sm" variant="destructive" aria-label="Remove from cart" formAction={removeFromCart.bind(null, item.id)}>Remove</Button>
                                </form>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold">Ksh {total}</span>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <form action={clearCart}>
                            <Button type="submit" variant="outline" formAction={clearCart}>Clear Cart</Button>
                        </form>
                        <Link href="/store/checkout">
                            <Button type="button" variant="default">Checkout</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    } catch (error) {
        return <div role="alert" className="text-destructive">Failed to load cart.</div>
    }
} 