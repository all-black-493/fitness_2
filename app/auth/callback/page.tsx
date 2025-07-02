"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase-utils/client"

export default function CallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<"loading" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        const access_token = searchParams.get("access_token")
        const refresh_token = searchParams.get("refresh_token")

        if (!access_token || !refresh_token) {
            setStatus("error")
            setMessage("Missing authentication tokens. Please try the magic link again.")
            return
        }

        const supabase = createClient()
        supabase.auth.setSession({ access_token, refresh_token })
            .then(({ error }) => {
                if (error) {
                    setStatus("error")
                    setMessage(error.message || "Failed to authenticate. Try again.")
                } else {
                    router.replace("/")
                }
            })
            .catch(() => {
                setStatus("error")
                setMessage("Unexpected error. Please try again.")
            })
    }, [router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Authenticating...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {status === "loading" && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Verifying your magic link...</p>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <XCircle className="h-12 w-12 text-red-500" />
                            <p className="text-sm text-muted-foreground">{message}</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 