"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { magicLinkAction, verifyMagicLinkAction } from "@/lib/actions/auth"
import { MagicLinkSchema, type MagicLinkInput } from "@/lib/validations/auth"
import { Dumbbell, Loader2, Mail } from "lucide-react"
import Link from "next/link"

export default function MagicLinkPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isMagicLinkPending, startMagicLinkTransition] = useTransition()
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: {
      email: "",
    },
  })

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid magic link")
      return
    }

    startMagicLinkTransition(async () => {
      const result = await verifyMagicLinkAction({ token_hash: token })

      if (result?.data?.success) {
        setStatus("success")
        setMessage(result.data.success)

        toast.success("You've been successfully logged in.")

        setTimeout(() => {
          router.push("/")
        })
      } else if (result?.data?.error) {
        setStatus("error")
        setMessage(result.data.error)
        toast.error(result.data.error)
      }
    })
  }, [token, router, toast])

  const sendMagicLink = () => {
    const email = form.getValues("email")
    if (!email) {
      toast.error("Please enter your email address first")
      return
    }

    startMagicLinkTransition(async () => {
      const result = await magicLinkAction({ email })

      if (result?.data?.success) {
        setMagicLinkSent(true)
        toast.success(result.data.success)
      } else if (result?.data?.error) {
        toast.error(result.data.error)
      }
    })
  }  

  const onSubmit = (data: MagicLinkInput) => {
    startMagicLinkTransition(async () => {
      const result = await magicLinkAction(data)

      if (result?.data?.success) {
        toast.success(result.data.success)
        router.push("/")
      } else if (result?.data?.error) {
        toast.error(result.data.error)
      }
    })
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" method="POST">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
                disabled={isMagicLinkPending}
                aria-invalid={!!form.formState.errors.email}
                aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
              />
              {form.formState.errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                  role="alert"
                >
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isMagicLinkPending} onClick={sendMagicLink}>
              {isMagicLinkPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link ...
                </>
              ) : (
                "Send Magic Link"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => router.push("/auth/pw-login")}
            disabled={isMagicLinkPending}
          >
            Sign In With Password
          </Button>

          {magicLinkSent && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Check your email for a magic link to sign in. The link will expire in 10 minutes.
              </AlertDescription>
            </Alert>
          )}


          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
