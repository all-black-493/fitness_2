"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { verifyMagicLinkAction } from "@/lib/actions/auth"
import { Dumbbell, Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

export default function MagicLinkPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid magic link")
      return
    }

    startTransition(async () => {
      const result = await verifyMagicLinkAction({ token })

      if (result?.data?.success) {
        setStatus("success")
        setMessage(result.data.success)

        // Set up countdown timer if we have expiration time
        if (result.data.expiresAt) {
          const expiresAt = new Date(result.data.expiresAt).getTime()
          const now = Date.now()
          const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
          setTimeRemaining(remaining)
        }

        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        })

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else if (result?.data?.error) {
        setStatus("error")
        setMessage(result.data.error)
        toast({
          title: "Login failed",
          description: result.data.error,
          variant: "destructive",
        })
      }
    })
  }, [token, router, toast])

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FitLogger</span>
          </div>
          <CardTitle>Magic Link Authentication</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your magic link..."}
            {status === "success" && "Successfully authenticated!"}
            {status === "error" && "Authentication failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Please wait while we verify your magic link...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">{message}</p>
                  <p className="text-xs text-muted-foreground">Redirecting to dashboard in 3 seconds...</p>
                  {timeRemaining !== null && timeRemaining > 0 && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        This magic link was valid for {formatTime(timeRemaining)} more seconds.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">{message}</p>
                  <div className="space-y-2">
                    <Button onClick={() => router.push("/auth/login")} className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/auth/register")} className="w-full">
                      Create Account
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
