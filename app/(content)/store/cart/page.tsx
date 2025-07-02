import { Cart } from "@/components/store/cart"

export default function CartPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <Cart />
        </div>
    )
} 